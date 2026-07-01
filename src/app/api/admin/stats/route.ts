/**
 * GET /api/admin/stats — Aggregate submission counts for KPI dashboard cards.
 * Protected by ADMIN_API_KEY.
 */

import { NextResponse } from "next/server";
import { validateAdminKey } from "@/lib/security";
import { getContactCounts } from "@/lib/contacts-db";
import { corsHeaders } from "@/lib/cors";

export async function GET(request: Request) {
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
    const counts = await getContactCounts();
    return NextResponse.json(
      { success: true, data: counts },
      { headers: corsHeaders(request) }
    );
  } catch (err) {
    console.error("Error fetching stats:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load submission stats" },
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
