import {
  ALLOWED_SITES_STORAGE_KEY,
  DEFAULT_SITE_PATTERNS,
} from './site-patterns';

export async function getAllowedPatterns(): Promise<string[]> {
  const r = await chrome.storage.local.get(ALLOWED_SITES_STORAGE_KEY);
  const v = r[ALLOWED_SITES_STORAGE_KEY];
  if (Array.isArray(v) && v.every((x) => typeof x === 'string')) {
    return [...new Set(v)].sort();
  }
  return [...DEFAULT_SITE_PATTERNS];
}

export async function setAllowedPatterns(patterns: string[]): Promise<void> {
  const unique = [...new Set(patterns.map((p) => p.trim()).filter(Boolean))].sort();
  await chrome.storage.local.set({ [ALLOWED_SITES_STORAGE_KEY]: unique });
}

/** Garante lista inicial (primeira instalação ou chave inexistente). */
export async function ensureDefaultSitePatterns(): Promise<void> {
  const r = await chrome.storage.local.get(ALLOWED_SITES_STORAGE_KEY);
  if (r[ALLOWED_SITES_STORAGE_KEY] === undefined) {
    await chrome.storage.local.set({
      [ALLOWED_SITES_STORAGE_KEY]: [...DEFAULT_SITE_PATTERNS],
    });
  }
}

export async function addAllowedPattern(pattern: string): Promise<void> {
  const cur = await getAllowedPatterns();
  if (!cur.includes(pattern)) {
    cur.push(pattern);
    await setAllowedPatterns(cur);
  }
}

export async function removeAllowedPattern(pattern: string): Promise<void> {
  const cur = await getAllowedPatterns();
  await setAllowedPatterns(cur.filter((p) => p !== pattern));
}

export { ALLOWED_SITES_STORAGE_KEY };
