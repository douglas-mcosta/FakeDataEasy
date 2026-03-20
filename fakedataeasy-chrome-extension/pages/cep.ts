import { copyToClipboard } from '../src/lib/clipboard';
import { CEP_REGIAO_LABEL, type CepRegiao, gerarCep } from '../src/lib/cep';
import { clearHistory, downloadCsv, getHistory, recordGenerated } from '../src/lib/generation-history';
import { initThemeOnPage } from '../src/lib/theme';

document.documentElement.lang = 'pt-BR';

void initThemeOnPage();

const regiaoEl = document.getElementById('cep-regiao') as HTMLSelectElement;
const input = document.getElementById('cep-input') as HTMLInputElement;
const btnGerar = document.getElementById('cep-gerar') as HTMLButtonElement;

const REGIOES = Object.keys(CEP_REGIAO_LABEL) as CepRegiao[];
for (const r of REGIOES) {
  const o = document.createElement('option');
  o.value = r;
  o.textContent = CEP_REGIAO_LABEL[r];
  regiaoEl.appendChild(o);
}

function comHifen(): boolean {
  const c = document.querySelector<HTMLInputElement>('input[name="cepMask"]:checked');
  return c?.value === '1';
}

document.querySelectorAll<HTMLInputElement>('input[name="cepMask"]').forEach((r) => {
  r.addEventListener('change', () => {
    const digits = input.value.replace(/\D/g, '').slice(0, 8);
    input.value =
      comHifen() && digits.length === 8 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    input.maxLength = comHifen() ? 9 : 8;
  });
});

btnGerar.addEventListener('click', async () => {
  const regiao = regiaoEl.value as CepRegiao;
  const h = comHifen();
  const v = gerarCep(regiao, h);
  recordGenerated('cep', v);
  await copyToClipboard(h ? v : v.replace(/\D/g, ''));
  input.value = v;
});

document.getElementById('cep-export')?.addEventListener('click', () => {
  const rows = getHistory('cep');
  if (rows.length === 0) {
    window.alert('Gere pelo menos um CEP com «↻ Gerar» antes de exportar.');
    return;
  }
  downloadCsv('fake-data-easy-cep.csv', 'cep', rows);
});

document.getElementById('cep-clear-hist')?.addEventListener('click', () => {
  clearHistory('cep');
});

input.maxLength = 9;
