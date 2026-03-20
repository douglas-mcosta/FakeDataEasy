/** Chave em `chrome.storage.local` */
export const ALLOWED_SITES_STORAGE_KEY = 'allowedSitePatterns';

/** Padrão de correspondência Chrome: origem + `/*` */
export const DEFAULT_SITE_PATTERNS: readonly string[] = [
  'http://localhost/*',
  'http://127.0.0.1/*',
  'https://localhost/*',
];

export function urlTabToMatchPattern(pageUrl: string): string | null {
  try {
    const u = new URL(pageUrl);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      return null;
    }
    return `${u.origin}/*`;
  } catch {
    return null;
  }
}

/**
 * Aceita URL completa, origem ou domínio; devolve `https://origem/*` ou `http://...`.
 */
export function normalizeManualPattern(line: string): string | null {
  let s = line.trim();
  if (!s) return null;

  if (!/^https?:\/\//i.test(s)) {
    s = `https://${s}`;
  }

  s = s.replace(/\s+/g, '');
  try {
    const base = s.endsWith('/*') ? s.slice(0, -2) : s;
    const u = new URL(base);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      return null;
    }
    return `${u.origin}/*`;
  } catch {
    return null;
  }
}
