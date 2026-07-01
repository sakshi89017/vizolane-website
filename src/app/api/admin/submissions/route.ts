/**
 * GET /api/admin/submissions — List all contact submissions.
 * Protected by ADMIN_API_KEY.
 */

import { NextResponse } from "next/server";
import { validateAdminKey } from "@/lib/security";
import { listContacts } from "@/lib/contacts-db";
import { corsHeaders, isAllowedOrigin } from "@/lib/cors";

export async function GET(request: Request) {
  /* ── CORS check ───────────────────────────────── */
  if (!isAllowedOrigin(request)) {
    return new NextResponse("CORS Not Allowed", { status: 403 });
  }

  /* ── Auth check ───────────────────────────────── */
  if (!validateAdminKey(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { 
        status: 401,
        headers: corsHeaders(request)
      }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await listContacts({ status, search, page, limit });

    return NextResponse.json(
      { success: true, data: result },
      { headers: corsHeaders(request) }
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Error in GET /api/admin/submissions:", errorMessage);
    return NextResponse.json(
      { success: false, error: "Failed to fetch submissions", detail: errorMessage },
      { 
        status: 500,
        headers: corsHeaders(request)
      }
    );
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}
