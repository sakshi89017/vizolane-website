/**
 * Centralized CORS helper for API routes.
 * Since the admin dashboard is served from the SAME origin as the API,
 * same-origin requests (no Origin header) are always allowed.
 */

const ALLOWED_ORIGINS = [
  "https://vizolane.com",
  "https://www.vizolane.com",
  "https://dashboard.vizolane.com",
  "https://vizolane-website.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");

  // Same-origin requests (no Origin header) are always allowed
  if (!origin) return true;

  // Check exact matches
  if (ALLOWED_ORIGINS.includes(origin)) return true;

  // Allow Vercel preview deployments (*.vercel.app)
  if (origin.endsWith(".vercel.app") && origin.startsWith("https://")) return true;

  return false;
}

export function getAllowedOrigin(request: Request): string {
  const origin = request.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.includes(origin) || (origin.endsWith(".vercel.app") && origin.startsWith("https://"))) {
    return origin;
  }
  return ALLOWED_ORIGINS[0]; // fallback to main domain
}

export function corsHeaders(request: Request): HeadersInit {
  const origin = getAllowedOrigin(request);
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-key, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

