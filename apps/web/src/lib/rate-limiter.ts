/**
 * In-memory sliding-window rate limiter.
 * Keyed by arbitrary string (e.g. API key prefix + endpoint).
 * Falls back gracefully — never throws.
 */

interface WindowEntry {
  count: number;
  windowStart: number;
}

// Global store (survives HMR in dev because of globalThis trick)
declare global {
  // eslint-disable-next-line no-var
  var _rateLimitStore: Map<string, WindowEntry> | undefined;
}

function getStore(): Map<string, WindowEntry> {
  if (!global._rateLimitStore) {
    global._rateLimitStore = new Map();
  }
  return global._rateLimitStore;
}

/**
 * Check whether the given key is within its limit for the window.
 *
 * @param key       - Unique identifier (e.g. `${apiKeyId}:notify`)
 * @param limit     - Max requests allowed per `windowMs`
 * @param windowMs  - Window length in milliseconds (default 3 600 000 = 1 h)
 * @returns `true`  if the request is allowed, `false` if rate-limited
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs = 3_600_000
): boolean {
  try {
    const store = getStore();
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now - entry.windowStart >= windowMs) {
      // New window
      store.set(key, { count: 1, windowStart: now });
      return true;
    }

    if (entry.count >= limit) {
      return false;
    }

    entry.count += 1;
    return true;
  } catch {
    // If anything goes wrong, allow the request (fail open)
    return true;
  }
}
