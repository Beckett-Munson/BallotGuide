#!/usr/bin/env python3
"""
scrape_legislation.py
=====================
Scrapes Pittsburgh City Council legislation from the Legistar public API
(2022–2025) and upserts into a Pinecone index configured with integrated
inference (auto-embeds the "text" field).

Data strategy:
  • MatterTitle  — always available, 170-620+ chars of description
  • Attachments  — PDFs & DOCX files with full legislation text (~76% of
                   matters have them).  Downloaded and parsed automatically.
  • Falls back to MatterTitle alone when no attachment text is extractable.

Prerequisites
-------------
    pip install -r requirements.txt
    cp env.example .env        # fill in your Pinecone keys
    python test_apis.py        # ← run this first to validate APIs

Usage
-----
    # Dry-run — fetch & chunk but don't upload (writes JSON to stdout)
    python scrape_legislation.py --dry-run --limit 10

    # Upload a small sample first
    python scrape_legislation.py --limit 20

    # Full run (all 2022-2025 Pittsburgh legislation)
    python scrape_legislation.py

    # Skip attachment downloads (faster, title-only text)
    python scrape_legislation.py --skip-attachments
"""

import argparse
import io
import json
import os
import re
import sys
import time
from datetime import datetime
from typing import Optional

import requests
from dotenv import load_dotenv

load_dotenv()

# ── Configuration ────────────────────────────────────────────────────────────
LEGISTAR_BASE = "https://webapi.legistar.com/v1"

SOURCES = [
    {
        "client": "pittsburgh",
        "label": "Pittsburgh City Council",
        "url_base": "https://pittsburgh.legistar.com",
    },
]

START_DATE = "2025-01-01"
END_DATE   = "2026-01-01"   # exclusive upper bound → covers through 2025-12-31

PINECONE_API_KEY   = os.environ.get("PINECONE_API_KEY", "")
PINECONE_INDEX     = os.environ.get("PINECONE_INDEX_NAME", "")
PINECONE_NAMESPACE = os.environ.get("PINECONE_NAMESPACE", "legislation")

# Chunking parameters — sentence-aware
CHUNK_TARGET = 800    # target characters per chunk (soft limit)
CHUNK_MAX    = 1200   # hard cap before forcing a split
CHUNK_OVERLAP_SENTS = 1  # number of trailing sentences to repeat in next chunk

# Pinecone batch size (records per upsert call)
UPSERT_BATCH = 20

# Legistar page size
PAGE_SIZE = 100

# Rate-limiting: seconds between Legistar API calls
LEGISTAR_DELAY = 0.2

# Max attachment size to download (5 MB)
MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024

# Pinecone token rate-limit (free tier: 250 000 tokens / minute)
PINECONE_TPM_LIMIT = 200_000   # stay under the 250k ceiling with headroom
TOKENS_PER_CHAR    = 0.30      # conservative estimate (~3.3 chars/token)


# ── Keyword → tag mapping (simple heuristic) ────────────────────────────────
TAG_KEYWORDS: dict[str, list[str]] = {
    "budget":         ["budget", "appropriation", "fiscal", "financial"],
    "finance":        ["finance", "tax", "revenue", "bond", "debt", "warrant"],
    "zoning":         ["zoning", "land use", "rezoning"],
    "public-safety":  ["police", "fire", "public safety", "emergency", "ems"],
    "infrastructure": ["infrastructure", "road", "bridge", "water", "sewer", "paving"],
    "housing":        ["housing", "affordable", "tenant", "landlord", "rent", "rental"],
    "health":         ["health", "hospital", "mental health", "opioid", "drug"],
    "education":      ["school", "education", "library"],
    "environment":    ["environment", "climate", "green", "sustainability", "pollution"],
    "transportation": ["transit", "transportation", "bus", "bike", "pedestrian"],
    "labor":          ["labor", "worker", "wage", "employment", "union"],
    "development":    ["development", "economic development", "grant", "incentive"],
    "contracts":      ["contract", "agreement", "vendor", "procurement", "rfp"],
    "public-works":   ["public works", "maintenance", "demolition", "construction"],
}


def assign_tags(text: str) -> list[str]:
    """Return a list of topic tags based on keyword matches in the text."""
    lower = text.lower()
    return sorted({
        tag for tag, keywords in TAG_KEYWORDS.items()
        if any(kw in lower for kw in keywords)
    })


# ── Sentence-aware text chunking ─────────────────────────────────────────────
_SENT_RE = re.compile(
    r'(?<=[.!?])\s+|'       # split after sentence-ending punctuation + space
    r'(?<=\n)\s*(?=\S)',     # split at paragraph breaks
    re.MULTILINE,
)


def _split_sentences(text: str) -> list[str]:
    """Split text into sentence-like segments."""
    parts = _SENT_RE.split(text.strip())
    return [p.strip() for p in parts if p and p.strip()]


def chunk_text(text: str) -> list[str]:
    """Split text into chunks that break at sentence boundaries.

    Strategy:
      1. Split the text into sentences.
      2. Greedily pack sentences until hitting CHUNK_TARGET.
      3. If a single sentence exceeds CHUNK_MAX, hard-split it.
      4. Carry the last CHUNK_OVERLAP_SENTS sentences into the next chunk
         for continuity.
    """
    text = text.strip()
    if not text:
        return []
    if len(text) <= CHUNK_TARGET:
        return [text]

    sentences = _split_sentences(text)
    if not sentences:
        return [text] if text else []

    chunks: list[str] = []
    current: list[str] = []
    current_len = 0

    for sent in sentences:
        sent_len = len(sent)

        # If a single sentence is larger than CHUNK_MAX, hard-split it
        if sent_len > CHUNK_MAX:
            # Flush current buffer first
            if current:
                chunks.append(" ".join(current))
                current = current[-CHUNK_OVERLAP_SENTS:] if CHUNK_OVERLAP_SENTS else []
                current_len = sum(len(s) + 1 for s in current)
            # Hard-split the long sentence
            for i in range(0, sent_len, CHUNK_MAX):
                piece = sent[i:i + CHUNK_MAX].strip()
                if piece:
                    chunks.append(piece)
            continue

        # Would adding this sentence exceed the target?
        if current_len + sent_len + 1 > CHUNK_TARGET and current:
            chunks.append(" ".join(current))
            # Overlap: carry last N sentences
            current = current[-CHUNK_OVERLAP_SENTS:] if CHUNK_OVERLAP_SENTS else []
            current_len = sum(len(s) + 1 for s in current)

        current.append(sent)
        current_len += sent_len + 1

    # Flush remaining
    if current:
        remainder = " ".join(current)
        # If the remainder is very small and we already have chunks, merge it
        if chunks and len(remainder) < 150:
            chunks[-1] = chunks[-1] + " " + remainder
        else:
            chunks.append(remainder)

    return [c.strip() for c in chunks if c.strip()]


# ── Attachment text extraction ───────────────────────────────────────────────
def extract_pdf_text(content: bytes) -> str:
    """Extract text from PDF bytes."""
    try:
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(content))
        parts = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                parts.append(t)
        return "\n".join(parts)
    except Exception:
        return ""


def extract_docx_text(content: bytes) -> str:
    """Extract text from DOCX bytes."""
    try:
        from docx import Document
        doc = Document(io.BytesIO(content))
        return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    except Exception:
        return ""


def download_attachment_text(url: str) -> str:
    """Download an attachment and extract its text content."""
    try:
        resp = requests.get(url, timeout=30, stream=True)
        if resp.status_code != 200:
            return ""
        cl = resp.headers.get("Content-Length")
        if cl and int(cl) > MAX_ATTACHMENT_BYTES:
            return ""
        content = resp.content
        if len(content) > MAX_ATTACHMENT_BYTES:
            return ""

        lower_url = url.lower()
        if lower_url.endswith(".pdf"):
            return extract_pdf_text(content)
        elif lower_url.endswith(".docx"):
            return extract_docx_text(content)
        return ""
    except Exception:
        return ""


# ── Legistar helpers ─────────────────────────────────────────────────────────
def fetch_matters(client: str, skip: int = 0) -> list[dict]:
    """Fetch one page of matters from the Legistar API."""
    url = (
        f"{LEGISTAR_BASE}/{client}/matters"
        f"?$filter=MatterIntroDate ge datetime'{START_DATE}'"
        f" and MatterIntroDate lt datetime'{END_DATE}'"
        f"&$orderby=MatterIntroDate asc"
        f"&$top={PAGE_SIZE}&$skip={skip}"
    )
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    return resp.json()


def fetch_attachments(client: str, matter_id: int) -> list[dict]:
    """Fetch attachment metadata for a matter."""
    url = f"{LEGISTAR_BASE}/{client}/matters/{matter_id}/attachments"
    try:
        resp = requests.get(url, timeout=15)
        resp.raise_for_status()
        data = resp.json()
        return data if isinstance(data, list) else []
    except Exception:
        return []


def matter_url(url_base: str, matter_id: int) -> str:
    """Build the public Legistar URL for a matter.

    The Legistar web UI uses different internal IDs than the REST API.
    The gateway endpoint (302 redirect) translates the API MatterId to the
    correct LegislationDetail page.  We follow the redirect to store the
    canonical direct URL so browsers don't hit session/cookie issues.
    """
    gateway = f"{url_base}/gateway.aspx?M=L&ID={matter_id}"
    try:
        resp = requests.head(gateway, allow_redirects=True, timeout=10)
        if resp.status_code == 200 and "LegislationDetail" in resp.url:
            return resp.url
    except Exception:
        pass
    return gateway


def parse_date(raw: Optional[str]) -> str:
    """Convert Legistar datetime string to ISO 8601 date."""
    if not raw:
        return ""
    try:
        return datetime.fromisoformat(raw.replace("Z", "+00:00")).strftime("%Y-%m-%d")
    except Exception:
        return raw[:10] if len(raw) >= 10 else ""


def clean_text(text: str) -> str:
    """Strip HTML tags, collapse whitespace, remove newlines."""
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\n+", " ", text)
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def build_citation(file_number: str, matter_type: str, intro_date: str,
                   body: str) -> str:
    """Build a short human-readable citation name.

    Examples:
      "Resolution 2025-1375 (2025-01-03)"
      "Ordinance 2024-0892 (2024-06-15)"
      "Report 2025-0089 — Committee on Finance and Law (2025-02-06)"
    """
    parts = []
    # Lead with type if available
    if matter_type:
        parts.append(matter_type)
    # File number is the authoritative identifier
    if file_number:
        parts.append(file_number)
    label = " ".join(parts) if parts else "Legislation"
    # Add the body for committee reports / referrals
    if body and body.strip():
        body_clean = body.strip().rstrip()
        label += f" — {body_clean}"
    # Date in parentheses
    if intro_date:
        label += f" ({intro_date})"
    return label


# ── Build records ────────────────────────────────────────────────────────────
def matter_to_records(
    matter: dict,
    client: str,
    source_label: str,
    url_base: str,
    skip_attachments: bool = False,
    verbose: bool = False,
) -> list[dict]:
    """
    Convert a single Legistar matter into one or more Pinecone records.
    Each record uses the integrated-inference schema:
        _id, text, title, type, date, url, source, tags, summary, citation
    """
    matter_id   = matter["MatterId"]
    file_number = matter.get("MatterFile", "") or ""
    title       = (matter.get("MatterTitle") or matter.get("MatterName") or "").strip()
    matter_type = (matter.get("MatterTypeName") or "").strip()
    intro_date  = parse_date(matter.get("MatterIntroDate"))
    status      = (matter.get("MatterStatusName") or "").strip()
    body        = (matter.get("MatterBodyName") or "").strip()

    if not title:
        return []

    # Build citation — short, readable reference name
    citation = build_citation(file_number, matter_type, intro_date, body)

    # Build a summary from metadata
    summary_parts = [f"Pittsburgh City Council {matter_type}" if matter_type
                     else "Pittsburgh City Council legislation"]
    if file_number:
        summary_parts[0] += f" {file_number}"
    if status:
        summary_parts.append(f"Status: {status}")
    if body and body.strip():
        summary_parts.append(f"Body: {body.strip()}")
    summary_parts.append(f"{title[:200]}")
    summary = ". ".join(summary_parts) + "."

    url = matter_url(url_base, matter_id)

    # ── Gather text ──────────────────────────────────────────────────────
    # Start with the title as the baseline text
    full_text = clean_text(title)

    # Try to enrich with attachment text
    if not skip_attachments:
        time.sleep(LEGISTAR_DELAY)
        attachments = fetch_attachments(client, matter_id)
        attachment_texts = []
        for att in attachments:
            link = att.get("MatterAttachmentHyperlink", "")
            if not link:
                continue
            lower_link = link.lower()
            if lower_link.endswith(".pdf") or lower_link.endswith(".docx"):
                atext = download_attachment_text(link)
                if atext and len(atext) > 50:
                    attachment_texts.append(clean_text(atext))
                    if verbose:
                        print(f"      📎 {att.get('MatterAttachmentName', '?')}: "
                              f"{len(atext)} chars extracted")

        if attachment_texts:
            full_text = full_text + " " + " ".join(attachment_texts)

    # Assign tags based on combined text
    tags = assign_tags(full_text)
    type_lower = matter_type.lower()
    if type_lower and type_lower not in tags:
        tags.append(type_lower)

    # Chunk the text
    chunks = chunk_text(full_text)
    if not chunks:
        return []

    records = []
    for i, chunk in enumerate(chunks):
        # Title: citation for single-chunk, citation + part N for multi-chunk
        chunk_title = (
            citation if len(chunks) == 1
            else f"{citation} [part {i+1}/{len(chunks)}]"
        )
        record = {
            "_id":      f"leg-{client}-{matter_id}-chunk{i}",
            "text":     chunk,
            "title":    chunk_title,
            "citation": citation,
            "type":     "legislation",
            "date":     intro_date,
            "url":      url,
            "source":   source_label,
            "tags":     tags,
            "summary":  summary,
        }
        records.append(record)
    return records


# ── Token-aware rate limiter ─────────────────────────────────────────────────
class TokenRateLimiter:
    """Rolling-window rate limiter that estimates Pinecone embedding tokens."""

    def __init__(self, tpm_limit: int = PINECONE_TPM_LIMIT, window: float = 60.0):
        self.tpm_limit = tpm_limit
        self.window = window
        self._log: list[tuple[float, int]] = []

    def _estimate_tokens(self, records: list[dict]) -> int:
        total_chars = sum(len(r.get("text", "")) for r in records)
        return int(total_chars * TOKENS_PER_CHAR)

    def _prune(self):
        cutoff = time.time() - self.window
        self._log = [(t, n) for t, n in self._log if t > cutoff]

    def _tokens_used(self) -> int:
        self._prune()
        return sum(n for _, n in self._log)

    def wait_if_needed(self, records: list[dict], verbose: bool = False):
        est = self._estimate_tokens(records)
        while True:
            self._prune()
            used = self._tokens_used()
            if used + est <= self.tpm_limit:
                break
            wait = self._log[0][0] + self.window - time.time() + 0.5
            if wait > 0:
                if verbose:
                    print(f"    ⏳ rate-limit: ~{used:,} tokens used, "
                          f"sleeping {wait:.1f}s …")
                time.sleep(wait)
        self._log.append((time.time(), est))


# ── Pinecone upsert ─────────────────────────────────────────────────────────
def get_pinecone_index():
    from pinecone import Pinecone
    pc = Pinecone(api_key=PINECONE_API_KEY)
    return pc.Index(PINECONE_INDEX)


def upsert_batch(index, records: list[dict], limiter: TokenRateLimiter,
                 verbose: bool = False):
    """Upsert a batch of records, respecting the token rate limit."""
    limiter.wait_if_needed(records, verbose=verbose)
    index.upsert_records(
        namespace=PINECONE_NAMESPACE,
        records=records,
    )


# ── Main pipeline ───────────────────────────────────────────────────────────
def run(
    *,
    dry_run: bool = False,
    limit: Optional[int] = None,
    verbose: bool = False,
    skip_attachments: bool = False,
):
    print(f"\n{'='*60}")
    print(f"  Legislation Scraper → Pinecone")
    print(f"  Date range        : {START_DATE} to {END_DATE}")
    print(f"  Sources           : {', '.join(s['label'] for s in SOURCES)}")
    print(f"  Dry run           : {dry_run}")
    print(f"  Limit             : {limit or 'none (all)'}")
    print(f"  Skip attachments  : {skip_attachments}")
    print(f"{'='*60}\n")

    limiter = TokenRateLimiter()

    if not dry_run:
        if not PINECONE_API_KEY or not PINECONE_INDEX:
            print("❌  Set PINECONE_API_KEY and PINECONE_INDEX_NAME in .env first.")
            sys.exit(1)
        idx = get_pinecone_index()
        print(f"✅  Connected to Pinecone index '{PINECONE_INDEX}'")
        print(f"     Token budget: {PINECONE_TPM_LIMIT:,} tokens/min "
              f"(batch size {UPSERT_BATCH})\n")
    else:
        idx = None

    total_matters = 0
    total_records = 0
    total_skipped = 0
    buffer: list[dict] = []

    for source in SOURCES:
        client   = source["client"]
        label    = source["label"]
        url_base = source["url_base"]
        print(f"\n── {label} ({client}) ──")

        skip = 0
        source_matters = 0

        while True:
            if limit and total_matters >= limit:
                break

            try:
                page = fetch_matters(client, skip=skip)
            except requests.exceptions.HTTPError as exc:
                if exc.response.status_code == 404:
                    print(f"  ⚠️  Client '{client}' not found on Legistar — skipping.")
                    break
                raise
            except Exception as exc:
                print(f"  ⚠️  Error fetching page at skip={skip}: {exc}")
                break

            if not page:
                break

            for matter in page:
                if limit and total_matters >= limit:
                    break

                total_matters += 1
                source_matters += 1
                matter_file = matter.get("MatterFile", "?")

                if verbose:
                    print(f"  [{total_matters}] {matter_file}: "
                          f"{(matter.get('MatterTitle') or '')[:60]}...")

                records = matter_to_records(
                    matter, client, label, url_base,
                    skip_attachments=skip_attachments,
                    verbose=verbose,
                )
                if not records:
                    total_skipped += 1
                    continue

                total_records += len(records)

                if dry_run:
                    for r in records[:3]:  # first 3 chunks in dry-run
                        print(json.dumps(r, indent=2))
                    if len(records) > 3:
                        print(f"    ... ({len(records) - 3} more chunks)")
                else:
                    buffer.extend(records)
                    while len(buffer) >= UPSERT_BATCH:
                        batch = buffer[:UPSERT_BATCH]
                        buffer = buffer[UPSERT_BATCH:]
                        upsert_batch(idx, batch, limiter, verbose=verbose)
                        if verbose:
                            print(f"    → upserted {len(batch)} records")

            # Progress update
            if not verbose:
                print(f"  Processed {source_matters} matters "
                      f"({total_records} records)...", end="\r")

            skip += PAGE_SIZE
            time.sleep(LEGISTAR_DELAY)

        print(f"\n  ✅  {label}: {source_matters} matters processed")

    # Flush remaining buffer
    if buffer and not dry_run:
        upsert_batch(idx, buffer, limiter, verbose=verbose)
        if verbose:
            print(f"    → upserted final {len(buffer)} records")

    print(f"\n{'='*60}")
    print(f"  DONE")
    print(f"  Total matters fetched  : {total_matters}")
    print(f"  Total records created  : {total_records}")
    print(f"  Matters skipped (empty): {total_skipped}")
    print(f"{'='*60}\n")


# ── CLI ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description="Scrape Pittsburgh legislation and upsert to Pinecone"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Fetch and chunk but don't upload — prints JSON records to stdout",
    )
    parser.add_argument(
        "--limit", type=int, default=None,
        help="Max number of legislation matters to process (useful for testing)",
    )
    parser.add_argument(
        "--verbose", "-v", action="store_true",
        help="Print detailed progress for each matter",
    )
    parser.add_argument(
        "--skip-attachments", action="store_true",
        help="Don't download attachment PDFs/DOCX — use title text only (faster)",
    )
    args = parser.parse_args()
    run(
        dry_run=args.dry_run,
        limit=args.limit,
        verbose=args.verbose,
        skip_attachments=args.skip_attachments,
    )


if __name__ == "__main__":
    main()
