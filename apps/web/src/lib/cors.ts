/**
 * CORS helpers for public /api/v1/* endpoints.
 * The widget runs on customer sites (cross-origin) so these endpoints
 * must emit proper CORS headers.
 */

export const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
};

/**
 * Respond to OPTIONS preflight requests.
 * Export from every public v1 route file:
 *   export { handleOptions as OPTIONS } from '@/lib/cors';
 */
export function handleOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

/**
 * Wrap a NextResponse so CORS headers are injected.
 * Use in GET/POST/PATCH/DELETE handlers:
 *   return withCors(NextResponse.json(data));
 */
export function withCors(res: Response): Response {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => {
    res.headers.set(k, v);
  });
  return res;
}
