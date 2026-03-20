import { copyToClipboard } from '../src/lib/clipboard';
import { CNPJ } from '../src/lib/cnpj';
import { CPF } from '../src/lib/cpf';
import { gerarGuid } from '../src/lib/guid';
import { gerarNome } from '../src/lib/nome';

document.documentElement.lang = 'pt-BR';

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
