/** Quando `false`, não regista content script do helper (só atalhos / popup). */
export const FIELD_HELPER_ENABLED_KEY = 'fde_field_helper_enabled';

/** Regras: padrão de URL Chrome + selector CSS + tipo de gerador. */
export const SELECTOR_OVERRIDES_KEY = 'fde_selector_overrides';

export type OverrideKind =
  | 'cpf'
  | 'cnpj'
  | 'nome'
  | 'nome_completo'
  | 'email'
  | 'tel'
  | 'cep'
  | 'data'
  | 'guid';

export type SelectorOverrideRule = {
  pattern: string;
  selector: string;
  kind: OverrideKind;
};

export const OVERRIDE_KIND_LABELS: Record<OverrideKind, string> = {
  cpf: 'CPF',
  cnpj: 'CNPJ',
  nome: 'Nome',
  nome_completo: 'Nome completo',
  email: 'E-mail',
  tel: 'Telefone (BR)',
  cep: 'CEP',
  data: 'Data (ISO)',
  guid: 'GUID',
};

export const OVERRIDE_KIND_OPTIONS: OverrideKind[] = [
  'cpf',
  'cnpj',
  'nome',
  'nome_completo',
  'email',
  'tel',
  'cep',
  'data',
  'guid',
];

export async function getFieldHelperEnabled(): Promise<boolean> {
  const r = await chrome.storage.local.get(FIELD_HELPER_ENABLED_KEY);
  if (r[FIELD_HELPER_ENABLED_KEY] === undefined) return true;
  return r[FIELD_HELPER_ENABLED_KEY] === true;
}

export async function setFieldHelperEnabled(enabled: boolean): Promise<void> {
  await chrome.storage.local.set({ [FIELD_HELPER_ENABLED_KEY]: enabled });
}

export async function ensureFieldHelperDefaults(): Promise<void> {
  const r = await chrome.storage.local.get(FIELD_HELPER_ENABLED_KEY);
  if (r[FIELD_HELPER_ENABLED_KEY] === undefined) {
    await chrome.storage.local.set({ [FIELD_HELPER_ENABLED_KEY]: true });
  }
}

export async function getSelectorOverrides(): Promise<SelectorOverrideRule[]> {
  const r = await chrome.storage.local.get(SELECTOR_OVERRIDES_KEY);
  const v = r[SELECTOR_OVERRIDES_KEY];
  if (!Array.isArray(v)) return [];
  const out: SelectorOverrideRule[] = [];
  for (const row of v) {
    if (!row || typeof row !== 'object') continue;
    const pattern = String((row as SelectorOverrideRule).pattern || '').trim();
    const selector = String((row as SelectorOverrideRule).selector || '').trim();
    const kind = String((row as SelectorOverrideRule).kind || '') as OverrideKind;
    if (!pattern || !selector) continue;
    if (!OVERRIDE_KIND_OPTIONS.includes(kind)) continue;
    out.push({ pattern, selector, kind });
  }
  return out;
}

export async function setSelectorOverrides(rules: SelectorOverrideRule[]): Promise<void> {
  await chrome.storage.local.set({ [SELECTOR_OVERRIDES_KEY]: rules });
}

/** Padrão estilo Chrome `https://host/*`. */
export function pageUrlMatchesPattern(pageUrl: string, matchPattern: string): boolean {
  const p = matchPattern.trim();
  if (!p.includes('://')) return false;
  try {
    if (p.endsWith('/*')) {
      const prefix = p.slice(0, -2);
      return pageUrl === prefix || pageUrl.startsWith(`${prefix}/`);
    }
    return pageUrl === p;
  } catch {
    return false;
  }
}
