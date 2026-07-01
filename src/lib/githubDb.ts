/**
 * GitHub REST Contents API client.
 * Uses a private GitHub repo as a database.
 */

const GITHUB_API = "https://api.github.com";

export class GitHubRateLimitError extends Error {
  retryAfter: number; // in seconds
  limitRemaining: number;

  constructor(message: string, retryAfter: number, limitRemaining: number) {
    super(message);
    this.name = "GitHubRateLimitError";
    this.retryAfter = retryAfter;
    this.limitRemaining = limitRemaining;
  }
}

export class GitHubConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitHubConflictError";
  }
}

export class GitHubNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GitHubNotFoundError";
  }
}

function getConfig() {
  const token = process.env.GITHUB_DB_TOKEN;
  const owner = process.env.GITHUB_DB_REPO_OWNER || process.env.GITHUB_DB_OWNER;
  const repo = process.env.GITHUB_DB_REPO_NAME || process.env.GITHUB_DB_REPO;

  if (!token || !owner || !repo) {
    throw new Error(
      "Missing GitHub DB configuration. Ensure GITHUB_DB_TOKEN, GITHUB_DB_REPO_OWNER, and GITHUB_DB_REPO_NAME are set."
    );
  }

  return { token, owner, repo };
}

function headers(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

interface GitHubFileResponse {
  name: string;
  path: string;
  sha: string;
  size: number;
  content?: string;
  encoding?: string;
  type: string;
}

/**
 * Handle common API errors (Rate Limit, Conflict, Not Found).
 */
async function handleResponseError(res: Response, path: string) {
  const limitRemaining = parseInt(res.headers.get("X-RateLimit-Remaining") || "0", 10);
  const rateLimitReset = parseInt(res.headers.get("X-RateLimit-Reset") || "0", 10);
  const now = Math.floor(Date.now() / 1000);
  const retryAfter = Math.max(0, rateLimitReset - now) || 60;

  if (res.status === 403 && limitRemaining === 0) {
    throw new GitHubRateLimitError(
      `GitHub API rate limit exceeded. Retry after ${retryAfter}s.`,
      retryAfter,
      limitRemaining
    );
  }

  if (res.status === 404) {
    throw new GitHubNotFoundError(`File not found at: ${path}`);
  }

  if (res.status === 409) {
    throw new GitHubConflictError(`Conflict/State error at: ${path}`);
  }

  const errText = await res.text();
  throw new Error(`GitHub API error on ${path} (${res.status}): ${errText}`);
}

/**
 * Read a file from the GitHub database repo. Returns parsed JSON content + SHA.
 */
export async function readFile<T = unknown>(
  path: string
): Promise<{ data: T; sha: string } | null> {
  const { token, owner, repo } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;

  try {
    const res = await fetch(url, { headers: headers(token), cache: "no-store" });

    if (res.status === 404) return null;
    if (!res.ok) {
      await handleResponseError(res, path);
    }

    const file: GitHubFileResponse = await res.json();
    if (!file.content) return null;

    const decoded = Buffer.from(file.content, "base64").toString("utf-8");
    const data: T = JSON.parse(decoded);
    return { data, sha: file.sha };
  } catch (err) {
    if (err instanceof GitHubNotFoundError) return null;
    throw err;
  }
}

/**
 * Write (create or update) a file in the GitHub database repo.
 * Automatically retries up to 3 times on 409 SHA conflict by fetching the latest SHA.
 */
export async function writeFile<T = unknown>(
  path: string,
  content: T,
  commitMessage?: string,
  sha?: string,
  attempt = 1
): Promise<{ sha: string }> {
  const { token, owner, repo } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;

  const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString("base64");

  const body: Record<string, string> = {
    message: commitMessage || `Update ${path}`,
    content: encoded,
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(body),
  });

  if (res.ok) {
    const result = await res.json();
    return { sha: result.content.sha };
  }

  // Handle conflict (409) with retry logic
  if (res.status === 409 && attempt <= 3) {
    console.warn(`SHA conflict writing to ${path} (Attempt ${attempt}/3). Fetching latest SHA to retry...`);
    const latest = await readFile<T>(path);
    const nextSha = latest ? latest.sha : undefined;
    return writeFile(path, content, commitMessage, nextSha, attempt + 1);
  }

  await handleResponseError(res, path);
  throw new Error("Unreachable");
}

/**
 * List files in a directory in the GitHub database repo.
 */
export async function listFiles(
  directory: string
): Promise<GitHubFileResponse[]> {
  const { token, owner, repo } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${directory}`;

  const res = await fetch(url, { headers: headers(token), cache: "no-store" });

  if (res.status === 404) return [];
  if (!res.ok) {
    await handleResponseError(res, directory);
  }

  const items: GitHubFileResponse[] = await res.json();
  return Array.isArray(items)
    ? items.filter((i) => i.type === "file" && i.name.endsWith(".json"))
    : [];
}

/**
 * Delete a file from the GitHub database repo.
 */
export async function deleteFile(
  path: string,
  sha: string,
  commitMessage?: string
): Promise<void> {
  const { token, owner, repo } = getConfig();
  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: headers(token),
    body: JSON.stringify({
      message: commitMessage || `Delete ${path}`,
      sha,
    }),
  });

  if (!res.ok) {
    await handleResponseError(res, path);
  }
}
