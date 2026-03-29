// Safe localStorage wrapper — handles Safari private browsing (throws on setItem),
// quota exceeded errors, and JSON parse failures.

const MAX_STORAGE_BYTES = 4 * 1024 * 1024; // 4 MB

export function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch { /* ignore */ }
}

export function safeGetJSON<T>(key: string): T | null {
  const raw = safeGet(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function safeSetJSON(key: string, value: unknown): boolean {
  try {
    return safeSet(key, JSON.stringify(value));
  } catch {
    return false;
  }
}

/** Estimate localStorage usage in bytes (UTF-16 → 2 bytes per char). */
export function getStorageUsageBytes(): number {
  try {
    let total = 0;
    for (const key of Object.keys(localStorage)) {
      total += (key.length + (localStorage.getItem(key)?.length ?? 0)) * 2;
    }
    return total;
  } catch {
    return 0;
  }
}

/**
 * If storage exceeds MAX_STORAGE_BYTES, prune the oldest swipe history,
 * keeping only the 100 most recent passed IDs.
 */
export function pruneStorageIfNeeded(): void {
  if (getStorageUsageBytes() <= MAX_STORAGE_BYTES) return;
  try {
    const passed = safeGetJSON<string[]>('pupular-passed') ?? [];
    if (passed.length > 100) {
      safeSetJSON('pupular-passed', passed.slice(-100));
    }
  } catch { /* ignore */ }
}
