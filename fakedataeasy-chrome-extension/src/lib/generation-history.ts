/** Histórico por separador (sessionStorage) para exportar CSV. */

const PREFIX = 'fde_hist_';
const MAX_ITENS = 1000;

function safeParse(key: string): string[] {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return [];
    const a = JSON.parse(raw) as unknown;
    return Array.isArray(a) && a.every((x) => typeof x === 'string') ? a : [];
  } catch {
    return [];
  }
}

export function recordGenerated(pageKey: string, value: string): void {
  if (!value) return;
  try {
    const k = PREFIX + pageKey;
    const arr = safeParse(k);
    arr.push(value);
    const trimmed = arr.length > MAX_ITENS ? arr.slice(-MAX_ITENS) : arr;
    sessionStorage.setItem(k, JSON.stringify(trimmed));
  } catch {
    /* modo privado / quota */
  }
}

export function getHistory(pageKey: string): string[] {
  return safeParse(PREFIX + pageKey);
}

export function clearHistory(pageKey: string): void {
  try {
    sessionStorage.removeItem(PREFIX + pageKey);
  } catch {
    /* — */
  }
}

export function downloadCsv(filename: string, columnHeader: string, rows: string[]): void {
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const lines = [columnHeader, ...rows.map(esc)].join('\r\n');
  const bom = '\uFEFF';
  const blob = new Blob([bom + lines], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
