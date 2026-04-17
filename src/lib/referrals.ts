import { safeGet, safeSet } from '@/utils/storage';

const REF_CODE_KEY = 'pupular-ref-code';
const REFERRER_KEY = 'pupular-referrer';

export function getOrCreateRefCode(): string {
  const existing = safeGet(REF_CODE_KEY);
  if (existing) return existing;

  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 7; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  safeSet(REF_CODE_KEY, code);
  return code;
}

export function getStoredReferrer(): string | null {
  return safeGet(REFERRER_KEY);
}

export function storeReferrer(refCode: string): boolean {
  return safeSet(REFERRER_KEY, refCode);
}
