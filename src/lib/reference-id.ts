/**
 * Reference ID generator: CNT-YYYYMMDD-XXXX
 * Counter is maintained in the GitHub DB repo at meta/counter.json
 */

import { readFile, writeFile } from "./githubDb";

const COUNTER_PATH = "meta/counter.json";

interface CounterData {
  date: string;
  count: number;
}

function getTodayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

/**
 * Generate the next sequential Reference ID.
 * Format: CNT-YYYYMMDD-XXXX (e.g., CNT-20260628-0001)
 */
export async function generateReferenceId(): Promise<string> {
  const today = getTodayString();

  const existing = await readFile<CounterData>(COUNTER_PATH);

  let count: number;
  let sha: string | undefined;

  if (existing && existing.data.date === today) {
    count = existing.data.count + 1;
    sha = existing.sha;
  } else if (existing) {
    /* New day — reset counter */
    count = 1;
    sha = existing.sha;
  } else {
    /* First ever entry */
    count = 1;
    sha = undefined;
  }

  const counterData: CounterData = { date: today, count };
  await writeFile(COUNTER_PATH, counterData, `Update counter to ${count}`, sha);

  const seq = String(count).padStart(4, "0");
  return `CNT-${today}-${seq}`;
}
