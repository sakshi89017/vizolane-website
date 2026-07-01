/**
 * Security utilities: input sanitization and Zod validation schemas
 */

import { z } from "zod";

/**
 * Sanitize a string to prevent XSS by encoding HTML entities.
 */
export function sanitizeInput(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Zod schema for contact form input validation.
 * Accepts both legacy field names (name) and new field names (fullName).
 */
export const contactFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name is required (at least 2 characters)")
    .max(100, "Name must be under 100 characters")
    .transform(sanitizeInput)
    .optional(),
  name: z
    .string()
    .min(2, "Name is required (at least 2 characters)")
    .max(100, "Name must be under 100 characters")
    .transform(sanitizeInput)
    .optional(),
  email: z
    .string()
    .email("A valid email address is required")
    .max(254, "Email must be under 254 characters")
    .transform((v) => v.trim().toLowerCase()),
  phone: z
    .string()
    .max(20, "Phone must be under 20 characters")
    .optional()
    .default("")
    .transform(sanitizeInput),
  subject: z
    .string()
    .max(200, "Subject must be under 200 characters")
    .optional()
    .default("Website Inquiry")
    .transform(sanitizeInput),
  message: z
    .string()
    .min(5, "Message is required (at least 5 characters)")
    .max(5000, "Message must be under 5000 characters")
    .transform(sanitizeInput),
}).transform((data) => ({
  ...data,
  fullName: data.fullName || data.name || "Unknown",
}));

export type ValidatedContactData = z.output<typeof contactFormSchema>;

/**
 * Validate admin API key from request headers.
 */
export function validateAdminKey(request: Request): boolean {
  const key = request.headers.get("x-admin-key");
  return !!key && key === process.env.ADMIN_API_KEY;
}
