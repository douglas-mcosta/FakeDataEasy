/** Preferência guardada; o documento usa sempre `light` ou `dark` efectivos. */
export const THEME_STORAGE_KEY = 'fde_theme_preference';
export type ThemePreference = 'system' | 'light' | 'dark';

export function resolveEffectiveTheme(pref: ThemePreference): 'light' | 'dark' {
  if (pref === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return pref;
}

export function applyThemeToDocument(effective: 'light' | 'dark'): void {
  document.documentElement.setAttribute('data-theme', effective);
}

export async function getThemePreference(): Promise<ThemePreference> {
  const r = await chrome.storage.local.get(THEME_STORAGE_KEY);
  const v = r[THEME_STORAGE_KEY];
  if (v === 'light' || v === 'dark' || v === 'system') return v;
  return 'system';
}

export async function setThemePreference(pref: ThemePreference): Promise<void> {
  await chrome.storage.local.set({ [THEME_STORAGE_KEY]: pref });
}

/**
 * Aplica tema inicial e mantém sincronizado (storage + mudança do sistema em modo automático).
 */
export async function initThemeOnPage(): Promise<void> {
  const pref = await getThemePreference();
  applyThemeToDocument(resolveEffectiveTheme(pref));

  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystemChange = (): void => {
    void getThemePreference().then((p) => {
      if (p === 'system') applyThemeToDocument(resolveEffectiveTheme(p));
    });
  };
  mq.addEventListener('change', onSystemChange);

  const onStorage = (
    changes: Record<string, chrome.storage.StorageChange>,
    area: chrome.storage.AreaName,
  ): void => {
    if (area !== 'local' || !changes[THEME_STORAGE_KEY]) return;
    const nv = changes[THEME_STORAGE_KEY].newValue;
    if (nv === 'light' || nv === 'dark' || nv === 'system') {
      applyThemeToDocument(resolveEffectiveTheme(nv));
    }
  };
  chrome.storage.onChanged.addListener(onStorage);
}
