import { DEFAULT_SITE_PATTERNS, normalizeManualPattern } from '../src/lib/site-patterns';
import { getAllowedPatterns, setAllowedPatterns } from '../src/lib/storage-sites';
import {
  getThemePreference,
  initThemeOnPage,
  setThemePreference,
  type ThemePreference,
  THEME_STORAGE_KEY,
} from '../src/lib/theme';

document.documentElement.lang = 'pt-BR';

void initThemeOnPage();

function initThemeControls(): void {
  void getThemePreference().then((pref) => {
    document.querySelectorAll<HTMLInputElement>('input[name="fde-theme"]').forEach((r) => {
      r.checked = r.value === pref;
    });
  });
  document.querySelector('.theme-options')?.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name !== 'fde-theme') return;
    const v = t.value;
    if (v === 'light' || v === 'dark' || v === 'system') void setThemePreference(v);
  });
}

initThemeControls();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || !changes[THEME_STORAGE_KEY]) return;
  const nv = changes[THEME_STORAGE_KEY].newValue as ThemePreference | undefined;
  if (nv !== 'light' && nv !== 'dark' && nv !== 'system') return;
  const radios = document.querySelectorAll<HTMLInputElement>('input[name="fde-theme"]');
  for (const r of radios) r.checked = r.value === nv;
});

const listEl = document.getElementById('site-list') as HTMLUListElement;
const manual = document.getElementById('manual-sites') as HTMLTextAreaElement;
const status = document.getElementById('status') as HTMLParagraphElement;

function setStatus(msg: string, err = false): void {
  status.textContent = msg;
  status.classList.toggle('err', err);
}

function parseLines(text: string): string[] {
  const out: string[] = [];
  for (const line of text.split(/\n/)) {
    const p = normalizeManualPattern(line);
    if (p) out.push(p);
  }
  return [...new Set(out)];
}

async function requestForPatterns(patterns: string[]): Promise<boolean> {
  const need: string[] = [];
  for (const p of patterns) {
    try {
      if (!(await chrome.permissions.contains({ origins: [p] }))) {
        need.push(p);
      }
    } catch {
      setStatus(`Padrão inválido para permissões: ${p}`, true);
      return false;
    }
  }
  if (need.length === 0) return true;
  return chrome.permissions.request({ origins: need });
}

async function renderList(): Promise<void> {
  const patterns = await getAllowedPatterns();
  listEl.innerHTML = '';
  for (const pat of patterns) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = pat;
    const permitted = await chrome.permissions.contains({ origins: [pat] }).catch(() => false);
    if (!permitted) {
      span.textContent += ' (sem permissão — carregue a página e use “Adicionar este site” no popup, ou conceda no Chrome)';
      span.classList.add('warn');
    }
    const rm = document.createElement('button');
    rm.type = 'button';
    rm.textContent = 'Remover';
    rm.addEventListener('click', async () => {
      const next = (await getAllowedPatterns()).filter((x) => x !== pat);
      await setAllowedPatterns(next);
      await renderList();
      setStatus('Site removido.');
    });
    li.appendChild(span);
    li.appendChild(rm);
    listEl.appendChild(li);
  }
}

document.getElementById('btn-merge')?.addEventListener('click', async () => {
  const added = parseLines(manual.value);
  if (added.length === 0) {
    setStatus('Nenhum site válido nas linhas.', true);
    return;
  }
  const cur = await getAllowedPatterns();
  const merged = [...new Set([...cur, ...added])];
  if (!(await requestForPatterns(merged))) {
    setStatus('Permissão necessária para novos sites.', true);
    return;
  }
  await setAllowedPatterns(merged);
  manual.value = '';
  await renderList();
  setStatus('Sites adicionados. Recarregue o separador para o helper aparecer.');
});

document.getElementById('btn-replace')?.addEventListener('click', async () => {
  const next = parseLines(manual.value);
  if (next.length === 0) {
    setStatus('Indique pelo menos um site válido para substituir a lista.', true);
    return;
  }
  if (!(await requestForPatterns(next))) {
    setStatus('Permissão negada.', true);
    return;
  }
  await setAllowedPatterns(next);
  manual.value = '';
  await renderList();
  setStatus('Lista substituída.');
});

document.getElementById('btn-defaults')?.addEventListener('click', async () => {
  await setAllowedPatterns([...DEFAULT_SITE_PATTERNS]);
  await renderList();
  setStatus('Lista reposta para o default (localhost).');
});

void renderList();
