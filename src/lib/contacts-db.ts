/**
 * Contacts CRUD operations on the GitHub-repo-as-database.
 * Each contact is stored as an individual JSON file: submissions/{referenceId}.json
 */

import type { Contact, ContactStatus } from "@/types/contact";
import type { ContactsQueryParams, PaginatedResponse } from "@/types/api";
import { readFile, writeFile, listFiles, deleteFile } from "./githubDb";
import { generateReferenceId } from "./reference-id";
import type { ValidatedContactData } from "./security";

const SUBMISSIONS_DIR = "submissions";

/**
 * Create a new contact record in the GitHub DB.
 */
export async function createContact(
  data: ValidatedContactData
): Promise<Contact> {
  const referenceId = await generateReferenceId();
  const now = new Date().toISOString();

  const contact: Contact = {
    referenceId,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone || "",
    subject: data.subject,
    message: data.message,
    status: "New",
    createdAt: now,
    updatedAt: now,
  };

  const path = `${SUBMISSIONS_DIR}/${referenceId}.json`;
  await writeFile(path, contact, `New contact: ${referenceId}`);

  return contact;
}

/**
 * Get a single contact by reference ID.
 */
export async function getContact(
  referenceId: string
): Promise<Contact | null> {
  const path = `${SUBMISSIONS_DIR}/${referenceId}.json`;
  const result = await readFile<Contact>(path);
  return result ? result.data : null;
}

/**
 * List contacts with optional filtering, search, and pagination.
 */
export async function listContacts(
  params: ContactsQueryParams = {}
): Promise<PaginatedResponse<Contact>> {
  const { status, search, page = 1, limit = 20 } = params;

  /* List all contact files */
  const files = await listFiles(SUBMISSIONS_DIR);

  /* Fetch each contact */
  const contacts: Contact[] = [];
  for (const file of files) {
    const result = await readFile<Contact>(`${SUBMISSIONS_DIR}/${file.name}`);
    if (result) contacts.push(result.data);
  }

  /* Filter by status */
  let filtered = contacts;
  if (status && status !== "All") {
    filtered = filtered.filter((c) => c.status === status);
  }

  /* Search by name, email, or referenceId */
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.referenceId.toLowerCase().includes(q)
    );
  }

  /* Sort by createdAt descending (newest first) */
  filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  /* Paginate */
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIdx = (page - 1) * limit;
  const items = filtered.slice(startIdx, startIdx + limit);

  return { items, total, page, limit, totalPages };
}

/**
 * Update a contact's status or other fields.
 */
export async function updateContact(
  referenceId: string,
  updates: Partial<Pick<Contact, "status">>
): Promise<Contact | null> {
  const path = `${SUBMISSIONS_DIR}/${referenceId}.json`;
  const existing = await readFile<Contact>(path);
  if (!existing) return null;

  const updated: Contact = {
    ...existing.data,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await writeFile(path, updated, `Update ${referenceId}: ${updates.status || "update"}`, existing.sha);
  return updated;
}

/**
 * Delete a contact record.
 */
export async function deleteContact(referenceId: string): Promise<boolean> {
  const path = `${SUBMISSIONS_DIR}/${referenceId}.json`;
  const existing = await readFile<Contact>(path);
  if (!existing) return false;

  await deleteFile(path, existing.sha, `Delete contact: ${referenceId}`);
  return true;
}

/**
 * Get summary counts for the dashboard KPI cards.
 */
export async function getContactCounts(): Promise<
  Record<"total" | "new" | "inProgress" | "resolved", number>
> {
  const files = await listFiles(SUBMISSIONS_DIR);

  const contacts: Contact[] = [];
  for (const file of files) {
    const result = await readFile<Contact>(`${SUBMISSIONS_DIR}/${file.name}`);
    if (result) contacts.push(result.data);
  }

  return {
    total: contacts.length,
    new: contacts.filter((c) => c.status === "New").length,
    inProgress: contacts.filter((c) => c.status === "In Progress").length,
    resolved: contacts.filter((c) => c.status === "Resolved").length,
  };
}
