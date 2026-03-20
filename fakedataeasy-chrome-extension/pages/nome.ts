import { copyToClipboard } from '../src/lib/clipboard';
import { clearHistory, downloadCsv, getHistory, recordGenerated } from '../src/lib/generation-history';
import {
  gerarNomeCompleto,
  gerarNomeFeminino,
  gerarNomeMasculino,
} from '../src/lib/nome';
import { initThemeOnPage } from '../src/lib/theme';

document.documentElement.lang = 'pt-BR';

void initThemeOnPage();

const input = document.getElementById('nome-input') as HTMLInputElement;
const btnGerar = document.getElementById('nome-gerar') as HTMLButtonElement;

function masculino(): boolean {
  const checked = document.querySelector<HTMLInputElement>('input[name="nomeGen"]:checked');
  return checked?.value === '1';
}

function nomeCompleto(): boolean {
  const c = document.querySelector<HTMLInputElement>('input[name="nomeTipo"]:checked');
  return c?.value === 'completo';
}

btnGerar.addEventListener('click', async () => {
  const m = masculino();
  const nome = nomeCompleto()
    ? gerarNomeCompleto(m)
    : m
      ? gerarNomeMasculino()
      : gerarNomeFeminino();
  recordGenerated('nome', nome);
  input.value = nome;
  await copyToClipboard(nome);
});

document.getElementById('nome-export')?.addEventListener('click', () => {
  const rows = getHistory('nome');
  if (rows.length === 0) {
    window.alert('Gere pelo menos um nome com «↻ Gerar» antes de exportar.');
    return;
  }
  downloadCsv('fake-data-easy-nomes.csv', 'nome', rows);
});

document.getElementById('nome-clear-hist')?.addEventListener('click', () => {
  clearHistory('nome');
});
