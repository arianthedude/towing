type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

/** Simple in-memory rate limiter (per process). Good enough for a single-instance deploy. */
export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000,
): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count };
}
