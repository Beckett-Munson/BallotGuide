import * as fs from 'fs';
import * as path from 'path';

export interface BallotPolicy {
  id: string;
  title: string;
  question: string;
}

let cached: BallotPolicy[] | null = null;

export function getBallotPolicies(): BallotPolicy[] {
  if (cached) return cached;
  const filePath = path.join(__dirname, '../../data/ballot_policies.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  cached = JSON.parse(raw);
  return cached!;
}

export function getBallotPolicyById(id: string): BallotPolicy | undefined {
  return getBallotPolicies().find((p) => p.id === id);
}

export function getPolicyTextForId(id: string): string | null {
  const policy = getBallotPolicyById(id);
  if (!policy) return null;
  return `${policy.title}\n\n${policy.question}`;
}
