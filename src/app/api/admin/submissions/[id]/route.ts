/**
 * GET, PATCH, DELETE /api/admin/submissions/[id] — Single submission operations.
 * Protected by ADMIN_API_KEY.
 */

import { NextResponse } from "next/server";
import { validateAdminKey } from "@/lib/security";
import { getContact, updateContact, deleteContact } from "@/lib/contacts-db";
import { corsHeaders } from "@/lib/cors";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
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
    const { id } = await params;
    // Input sanitization / validation to prevent path traversal
    if (id.includes("/") || id.includes("..") || id.includes("\\")) {
      return NextResponse.json(
        { success: false, error: "Invalid Reference ID format" },
        { 
          status: 400,
          headers: corsHeaders(request)
        }
      );
    }

    const contact = await getContact(id);

    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { 
          status: 404,
          headers: corsHeaders(request)
        }
      );
    }

    return NextResponse.json(
      { success: true, data: contact },
      { headers: corsHeaders(request) }
    );
  } catch (err) {
    console.error(`Error fetching submission ${params}:`, err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch submission details" },
      { 
        status: 500,
        headers: corsHeaders(request)
      }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
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
    const { id } = await params;
    if (id.includes("/") || id.includes("..") || id.includes("\\")) {
      return NextResponse.json(
        { success: false, error: "Invalid Reference ID format" },
        { 
          status: 400,
          headers: corsHeaders(request)
        }
      );
    }

    const body = await request.json();
    const { status } = body;

    const validStatuses = ["New", "In Progress", "Resolved"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status. Must be: New, In Progress, or Resolved" },
        { 
          status: 400,
          headers: corsHeaders(request)
        }
      );
    }

    const updated = await updateContact(id, { status });
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { 
          status: 404,
          headers: corsHeaders(request)
        }
      );
    }

    return NextResponse.json(
      { success: true, data: updated },
      { headers: corsHeaders(request) }
    );
  } catch (err) {
    console.error(`Error updating submission ${params}:`, err);
    return NextResponse.json(
      { success: false, error: "Failed to update submission" },
      { 
        status: 500,
        headers: corsHeaders(request)
      }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
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
    const { id } = await params;
    if (id.includes("/") || id.includes("..") || id.includes("\\")) {
      return NextResponse.json(
        { success: false, error: "Invalid Reference ID format" },
        { 
          status: 400,
          headers: corsHeaders(request)
        }
      );
    }

    const deleted = await deleteContact(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { 
          status: 404,
          headers: corsHeaders(request)
        }
      );
    }

    return NextResponse.json(
      { success: true, message: "Submission deleted successfully" },
      { headers: corsHeaders(request) }
    );
  } catch (err) {
    console.error(`Error deleting submission ${params}:`, err);
    return NextResponse.json(
      { success: false, error: "Failed to delete submission" },
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
