/**
 * A per-instance sliding-window limiter - the one api/contact has, as a factory.
 * Enough to stop a script hammering one server; not a substitute for a real
 * limiter once the site runs on several.
 */
export function createLimiter(windowMs: number, max: number) {
  const hits = new Map<string, number[]>();
  return function limited(key: string): boolean {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(key, recent);
    return recent.length > max;
  };
}
