/**
 * Centralized CORS helper for API routes.
 */

const ALLOWED_ORIGINS = [
  "https://vizolane.com",
  "https://dashboard.vizolane.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

export function getAllowedOrigin(request: Request): string {
  const origin = request.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
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
