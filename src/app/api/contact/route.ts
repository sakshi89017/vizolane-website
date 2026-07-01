/**
 * POST /api/contact — Public contact form submission endpoint.
 * Validates input, generates reference ID, writes to GitHub DB.
 * Rate-limited to 5 requests per 15 minutes per IP.
 */

import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/security";
import { createContact } from "@/lib/contacts-db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    /* ── Rate limiting ──────────────────────────── */
    const ip = getClientIp(request);
    const { limited, retryAfterMs } = checkRateLimit(ip);

    if (limited) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again after 15 minutes.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((retryAfterMs || 900000) / 1000)),
          },
        }
      );
    }

    /* ── Parse and validate input ───────────────── */
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message);
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    /* ── Create contact in GitHub DB ────────────── */
    const contact = await createContact(parsed.data);

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you! Your message has been received. We'll get back to you soon.",
        referenceId: contact.referenceId,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error in POST /api/contact:", err);
    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong. Please try again or email us at admin@vizolane.com.",
      },
      { status: 500 }
    );
  }
}
