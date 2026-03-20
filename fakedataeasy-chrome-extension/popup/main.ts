import { copyToClipboard } from '../src/lib/clipboard';
import { CNPJ } from '../src/lib/cnpj';
import { CPF } from '../src/lib/cpf';
import { gerarGuid } from '../src/lib/guid';
import { gerarNome } from '../src/lib/nome';
import { addAllowedPattern } from '../src/lib/storage-sites';
import { urlTabToMatchPattern } from '../src/lib/site-patterns';
import { openExtensionSettingsPage } from '../src/lib/extension-nav';
import { initThemeOnPage } from '../src/lib/theme';

document.documentElement.lang = 'pt-BR';

void initThemeOnPage();

const PREVIEW_MS = 2000;

function flashPreview(row: HTMLElement, text: string): void {
  const el = row.querySelector<HTMLElement>('.preview');
  if (!el) return;
  el.textContent = `${text} ✓`;
  el.hidden = false;
  window.setTimeout(() => {
    el.textContent = '';
    el.hidden = true;
  }, PREVIEW_MS);
}

async function handleCopy(kind: string, row: HTMLElement): Promise<void> {
  let value: string;
  switch (kind) {
    case 'cpf':
      value = CPF.gerarSemPontos();
      break;
    case 'cnpj':
      value = CNPJ.gerarSemPontos();
      break;
    case 'nome':
      value = gerarNome();
      break;
    case 'guid':
      value = gerarGuid();
      break;
    default:
      return;
  }
  await copyToClipboard(value);
  flashPreview(row, value);
}

document.querySelectorAll<HTMLTableRowElement>('.menu-table tr[data-kind]').forEach((row) => {
  const kind = row.getAttribute('data-kind');
  if (!kind) return;
  const btn = row.querySelector<HTMLButtonElement>('.btn-copy');
  btn?.addEventListener('click', () => void handleCopy(kind, row));
});

const siteLabel = document.getElementById('current-site-label');
const btnAddSite = document.getElementById('btn-add-current-site') as HTMLButtonElement | null;
const addSiteHint = document.getElementById('add-site-hint');
const btnOpenOptions = document.getElementById('btn-open-options');
const btnSectionSettings = document.getElementById('btn-section-settings');

function setAddHint(text: string, err = false): void {
  if (!addSiteHint) return;
  addSiteHint.textContent = text;
  addSiteHint.hidden = !text;
  addSiteHint.classList.toggle('err', err);
}

async function refreshCurrentSite(): Promise<void> {
  if (!siteLabel || !btnAddSite) return;
  setAddHint('', false);
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab?.url ?? '';
  if (!url) {
    siteLabel.textContent = 'Não foi possível ler o separador.';
    btnAddSite.disabled = true;
    return;
  }
  if (/^(chrome|edge|about|devtools|chrome-extension):/i.test(url)) {
    siteLabel.textContent = 'Abra um site http(s) para adicionar à lista.';
    btnAddSite.disabled = true;
    return;
  }
  const pattern = urlTabToMatchPattern(url);
  if (!pattern) {
    siteLabel.textContent = 'URL não suportada para lista de sites.';
    btnAddSite.disabled = true;
    return;
  }
  siteLabel.textContent = pattern;
  btnAddSite.disabled = false;
}

btnAddSite?.addEventListener('click', () => {
  void (async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab?.url;
    if (!url) return;
    const pattern = urlTabToMatchPattern(url);
    if (!pattern) {
      setAddHint('URL inválida.', true);
      return;
    }
    const granted = await chrome.permissions.request({ origins: [pattern] });
    if (!granted) {
      setAddHint('Permissão negada para este site.', true);
      return;
    }
    await addAllowedPattern(pattern);
    setAddHint('Adicionado. Recarregue a página para ver os botões nos campos.');
  })();
});

function wireOpenSettings(el: HTMLElement | null): void {
  el?.addEventListener('click', () => {
    openExtensionSettingsPage();
  });
}

wireOpenSettings(btnOpenOptions);
wireOpenSettings(btnSectionSettings);

void refreshCurrentSite();
