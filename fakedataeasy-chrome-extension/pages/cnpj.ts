import { copyToClipboard } from '../src/lib/clipboard';
import { CNPJ } from '../src/lib/cnpj';
import { formatCnpjDigits } from '../src/lib/format-br';
import { onlyNumbers } from '../src/lib/string-utils';

document.documentElement.lang = 'pt-BR';

const input = document.getElementById('cnpj-input') as HTMLInputElement;
const btnGerar = document.getElementById('cnpj-gerar') as HTMLButtonElement;

function maskComPontos(): boolean {
  const checked = document.querySelector<HTMLInputElement>('input[name="cnpjMask"]:checked');
  return checked?.value === '1';
}

function applyCnpjDisplay(rawDigits: string): void {
  const d = onlyNumbers(rawDigits).slice(0, 14);
  input.value = maskComPontos() ? formatCnpjDigits(d) : d;
  input.maxLength = maskComPontos() ? 18 : 14;
  refreshCnpjValidity();
}

function refreshCnpjValidity(): void {
  const raw = onlyNumbers(input.value);
  input.classList.remove('valid', 'invalid');
  if (raw.length === 14) {
    input.classList.add(CNPJ.validar(raw) ? 'valid' : 'invalid');
  }
}

document.querySelectorAll<HTMLInputElement>('input[name="cnpjMask"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    applyCnpjDisplay(onlyNumbers(input.value));
  });
});

input.addEventListener('input', () => {
  const raw = onlyNumbers(input.value).slice(0, 14);
  applyCnpjDisplay(raw);
});

btnGerar.addEventListener('click', async () => {
  const raw = CNPJ.gerarSemPontos();
  await copyToClipboard(raw);
  applyCnpjDisplay(raw);
});

applyCnpjDisplay('');
