#!/usr/bin/env python3
"""
scrape_legal_code.py
====================
Scrapes the Pennsylvania Consolidated Statutes from the PA General Assembly
website and upserts them into a Pinecone index configured with integrated
inference (auto-embeds the "text" field).

Data source:
  PA General Assembly — full HTML text of every title is available at
  https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM/{ttl}/{ttl}.HTM
  (66 titles, from Title 10 through Title 75; some are reserved/empty)

Strategy:
  • Downloads each title's full HTML (~3 KB for reserved titles up to ~7 MB)
  • Skips reserved/placeholder titles
  • Parses HTML → clean text via BeautifulSoup
  • Splits into overlapping ~1 000-character chunks
  • Upserts to Pinecone with rich metadata (title number, name, source URL, tags)

Prerequisites
-------------
    pip install -r requirements.txt
    cp env.example .env        # fill in your Pinecone keys
    python test_apis.py        # validate Pinecone connectivity

Usage
-----
    # Dry-run — fetch & chunk a few titles, print JSON records
    python scrape_legal_code.py --dry-run --limit 3

    # Upload a small sample
    python scrape_legal_code.py --limit 5

    # Full run (all PA titles)
    python scrape_legal_code.py

    # Only specific titles (space-separated)
    python scrape_legal_code.py --titles 18 42 53 75
"""

import argparse
import json
import os
import re
import sys
import time
from typing import Optional

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

# ── Configuration ────────────────────────────────────────────────────────────
PA_STATUTES_BASE = "https://www.legis.state.pa.us/WU01/LI/LI/CT/HTM"
PA_LEGIS_INDEX   = "https://www.legis.state.pa.us/cfdocs/legis/LI/Public/cons_index.cfm"

PINECONE_API_KEY   = os.environ.get("PINECONE_API_KEY", "")
PINECONE_INDEX     = os.environ.get("PINECONE_INDEX_NAME", "")
PINECONE_NAMESPACE = os.environ.get("PINECONE_NAMESPACE", "legal-code")

# Chunking parameters
CHUNK_SIZE    = 1000   # characters per chunk
CHUNK_OVERLAP = 200    # overlap between consecutive chunks

# Pinecone batch size
UPSERT_BATCH = 20

# Rate-limiting: seconds between PA website requests
REQUEST_DELAY = 0.5

# Pinecone token rate-limit (free tier: 250 000 tokens / minute)
PINECONE_TPM_LIMIT = 200_000   # stay under the 250k ceiling with headroom
TOKENS_PER_CHAR    = 0.30      # conservative estimate (~3.3 chars/token)

# Minimum bytes for a title to be "real" (reserved titles are ~3800 bytes)
MIN_TITLE_BYTES = 5000

# Browser-like headers (the PA website blocks bare requests)
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
}

# Title range to scan (PA Consolidated Statutes run from Title 1 to ~75)
TITLE_RANGE = range(1, 76)

# ── Keyword → tag mapping ───────────────────────────────────────────────────
TAG_KEYWORDS: dict[str, list[str]] = {
    "criminal":       ["crime", "offense", "felony", "misdemeanor", "penalty",
                       "imprisonment", "guilty", "conviction", "homicide", "assault"],
    "property":       ["property", "real estate", "deed", "mortgage", "lien", "tenant",
                       "landlord", "lease"],
    "family":         ["marriage", "divorce", "custody", "child", "domestic", "adoption",
                       "spouse", "alimony"],
    "finance":        ["tax", "taxation", "revenue", "fiscal", "bond", "debt", "budget",
                       "appropriation"],
    "municipal":      ["municipal", "borough", "township", "county", "city", "local",
                       "ordinance"],
    "transportation": ["vehicle", "driver", "highway", "road", "traffic", "license",
                       "registration"],
    "environment":    ["environment", "pollution", "water", "air quality", "conservation",
                       "wildlife"],
    "health":         ["health", "hospital", "medical", "drug", "pharmacy", "mental health"],
    "education":      ["school", "education", "university", "teacher", "student"],
    "labor":          ["employment", "labor", "worker", "wage", "union", "compensation",
                       "unemployment"],
    "judiciary":      ["court", "judge", "jury", "judicial", "jurisdiction", "appeal",
                       "evidence"],
    "election":       ["election", "ballot", "voter", "candidate", "campaign", "primary"],
    "public-safety":  ["police", "fire", "emergency", "safety", "prison", "parole"],
    "business":       ["corporation", "partnership", "business", "license", "commerce",
                       "trade"],
    "utilities":      ["utility", "electric", "gas", "telephone", "water supply",
                       "public utility"],
}


def assign_tags(text: str) -> list[str]:
    """Return topic tags based on keyword matches."""
    lower = text.lower()
    return sorted({
        tag for tag, keywords in TAG_KEYWORDS.items()
        if any(kw in lower for kw in keywords)
    })


# ── Text chunking ────────────────────────────────────────────────────────────
def chunk_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Split text into overlapping chunks."""
    text = text.strip()
    if not text:
        return []
    if len(text) <= size:
        return [text]
    chunks = []
    start = 0
    while start < len(text):
        end = start + size
        chunk = text[start:end]
        chunks.append(chunk.strip())
        start += size - overlap
    return [c for c in chunks if c]


# ── HTML parsing ─────────────────────────────────────────────────────────────
def html_to_text(html: str) -> str:
    """Convert PA statute HTML to clean readable text."""
    soup = BeautifulSoup(html, "html.parser")

    # Remove scripts, styles, navigation
    for tag in soup(["script", "style", "nav", "header", "footer"]):
        tag.decompose()

    # Get text
    text = soup.get_text(separator="\n")

    # Clean up
    text = text.replace("\xa0", " ")          # &nbsp;
    text = re.sub(r"\n+", " ", text)           # replace all newlines with spaces
    text = re.sub(r"[ \t]+", " ", text)        # collapse horizontal whitespace
    text = text.strip()

    # Remove boilerplate header/footer (PA site adds navigation text)
    # Look for the actual title content start
    for marker in ["TITLE ", "Title ", "PART ", "CHAPTER "]:
        idx = text.find(marker)
        if idx != -1 and idx < 500:
            text = text[idx:]
            break

    return text


def extract_title_name(html: str) -> str:
    """Extract the title name from the HTML <title> tag or first heading."""
    soup = BeautifulSoup(html, "html.parser")
    title_tag = soup.find("title")
    if title_tag:
        name = title_tag.get_text().strip()
        # Format: "Title 18 - CRIMES AND OFFENSES"
        return name
    return ""


# ── PA Statutes fetching ────────────────────────────────────────────────────
def fetch_title_html(ttl: int) -> Optional[str]:
    """Download the full HTML for a PA statute title. Returns None on failure."""
    url = f"{PA_STATUTES_BASE}/{ttl}/{ttl}.HTM"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=60)
        if resp.status_code == 200:
            return resp.text
        return None
    except Exception:
        return None


def title_url(ttl: int) -> str:
    """Public URL for a statute title."""
    return f"{PA_STATUTES_BASE}/{ttl}/{ttl}.HTM"


def is_reserved_title(html: str) -> bool:
    """Check if a title is just a '(RESERVED)' placeholder."""
    if len(html) < MIN_TITLE_BYTES:
        return True
    if "(RESERVED)" in html[:2000]:
        return True
    return False


# ── Build records ────────────────────────────────────────────────────────────
def title_to_records(ttl: int, html: str) -> list[dict]:
    """Convert a PA statute title into Pinecone records."""
    title_name = extract_title_name(html)
    text = html_to_text(html)

    if not text or len(text) < 100:
        return []

    url = title_url(ttl)
    source = "Pennsylvania General Assembly"

    # Assign tags based on the full text (sample first 5000 chars for speed)
    tags = assign_tags(text[:5000])

    # Determine type from title name
    summary = f"Pennsylvania Consolidated Statutes, {title_name}."

    # Chunk the text
    chunks = chunk_text(text)
    if not chunks:
        return []

    records = []
    for i, chunk in enumerate(chunks):
        chunk_title = (
            title_name if len(chunks) == 1
            else f"{title_name} [part {i+1}/{len(chunks)}]"
        )
        record = {
            "_id":     f"pa-statute-t{ttl}-chunk{i}",
            "text":    chunk,
            "title":   chunk_title,
            "type":    "legal-code",
            "date":    "",  # statutes are current/living law — no single date
            "url":     url,
            "source":  source,
            "tags":    tags,
            "summary": summary,
        }
        records.append(record)
    return records


# ── Token-aware rate limiter ──────────────────────────────────────────────────
class TokenRateLimiter:
    """Rolling-window rate limiter that estimates Pinecone embedding tokens."""

    def __init__(self, tpm_limit: int = PINECONE_TPM_LIMIT, window: float = 60.0):
        self.tpm_limit = tpm_limit
        self.window = window          # seconds
        self._log: list[tuple[float, int]] = []   # (timestamp, tokens)

    def _estimate_tokens(self, records: list[dict]) -> int:
        """Estimate how many embedding tokens a batch will use."""
        total_chars = sum(len(r.get("text", "")) for r in records)
        return int(total_chars * TOKENS_PER_CHAR)

    def _prune(self):
        """Drop entries older than the rolling window."""
        cutoff = time.time() - self.window
        self._log = [(t, n) for t, n in self._log if t > cutoff]

    def _tokens_used(self) -> int:
        self._prune()
        return sum(n for _, n in self._log)

    def wait_if_needed(self, records: list[dict], verbose: bool = False):
        """Block until there is room under the token ceiling, then record."""
        est = self._estimate_tokens(records)
        while True:
            self._prune()
            used = self._tokens_used()
            if used + est <= self.tpm_limit:
                break
            wait = self._log[0][0] + self.window - time.time() + 0.5
            if wait > 0:
                if verbose:
                    print(f"        ⏳ rate-limit: ~{used:,} tokens used, "
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
    titles: Optional[list[int]] = None,
):
    title_range = titles if titles else list(TITLE_RANGE)

    print(f"\n{'='*60}")
    print(f"  PA Consolidated Statutes → Pinecone")
    print(f"  Titles to scan : {len(title_range)} "
          f"({title_range[0]}–{title_range[-1]})")
    print(f"  Dry run        : {dry_run}")
    print(f"  Limit          : {limit or 'none (all)'}")
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

    total_titles_processed = 0
    total_titles_skipped   = 0
    total_records          = 0
    buffer: list[dict]     = []

    for ttl in title_range:
        if limit and total_titles_processed >= limit:
            break

        print(f"  Title {ttl:2d}: ", end="", flush=True)

        html = fetch_title_html(ttl)
        if html is None:
            print("not found (404)")
            total_titles_skipped += 1
            time.sleep(REQUEST_DELAY)
            continue

        if is_reserved_title(html):
            name = extract_title_name(html)
            print(f"skipped — {name or 'reserved/empty'} ({len(html)} bytes)")
            total_titles_skipped += 1
            time.sleep(REQUEST_DELAY)
            continue

        name = extract_title_name(html)
        text = html_to_text(html)
        records = title_to_records(ttl, html)
        total_titles_processed += 1
        total_records += len(records)

        print(f"✅ {name} — {len(text):,} chars → {len(records)} chunks")

        if verbose:
            print(f"        Text preview: {text[:120]}...")
            if records:
                print(f"        Tags: {records[0].get('tags', [])}")

        if dry_run:
            for r in records[:3]:  # only print first 3 chunks per title in dry-run
                print(json.dumps(r, indent=2))
            if len(records) > 3:
                print(f"        ... ({len(records) - 3} more chunks)")
        else:
            buffer.extend(records)
            while len(buffer) >= UPSERT_BATCH:
                batch = buffer[:UPSERT_BATCH]
                buffer = buffer[UPSERT_BATCH:]
                upsert_batch(idx, batch, limiter, verbose=verbose)
                if verbose:
                    print(f"        → upserted {len(batch)} records")

        time.sleep(REQUEST_DELAY)

    # Flush remaining buffer
    if buffer and not dry_run:
        upsert_batch(idx, buffer, limiter, verbose=verbose)
        if verbose:
            print(f"        → upserted final {len(buffer)} records")

    print(f"\n{'='*60}")
    print(f"  DONE")
    print(f"  Titles processed : {total_titles_processed}")
    print(f"  Titles skipped   : {total_titles_skipped}")
    print(f"  Total records    : {total_records}")
    print(f"{'='*60}\n")


# ── CLI ──────────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description="Scrape PA Consolidated Statutes and upsert to Pinecone"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Fetch and chunk but don't upload — prints JSON records to stdout",
    )
    parser.add_argument(
        "--limit", type=int, default=None,
        help="Max number of titles to process",
    )
    parser.add_argument(
        "--verbose", "-v", action="store_true",
        help="Print detailed progress",
    )
    parser.add_argument(
        "--titles", type=int, nargs="+", default=None,
        help="Specific title numbers to process (e.g. --titles 18 42 53 75)",
    )
    args = parser.parse_args()
    run(
        dry_run=args.dry_run,
        limit=args.limit,
        verbose=args.verbose,
        titles=args.titles,
    )


if __name__ == "__main__":
    main()
