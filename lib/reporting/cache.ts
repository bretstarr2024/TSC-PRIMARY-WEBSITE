/**
 * Simple in-memory cache for dashboard data.
 * 15-minute TTL by default. Keyed by source + period.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function cacheKey(...parts: string[]): string {
  return parts.join(':');
}

export function getCached<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttlMs = 15 * 60 * 1000): void {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export function clearCache(keyPrefix?: string): void {
  if (!keyPrefix) { store.clear(); return; }
  Array.from(store.keys()).forEach(key => {
    if (key.startsWith(keyPrefix)) store.delete(key);
  });
}
