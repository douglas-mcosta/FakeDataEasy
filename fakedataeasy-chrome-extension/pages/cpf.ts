import { copyToClipboard } from '../src/lib/clipboard';
import { CPF } from '../src/lib/cpf';
import { formatCpfDigits } from '../src/lib/format-br';
import { onlyNumbers } from '../src/lib/string-utils';
import { initThemeOnPage } from '../src/lib/theme';

document.documentElement.lang = 'pt-BR';

void initThemeOnPage();

const form = document.getElementById('cpf-form') as HTMLFormElement;
const input = document.getElementById('cpf-input') as HTMLInputElement;
const btnGerar = document.getElementById('cpf-gerar') as HTMLButtonElement;
const validMsg = document.getElementById('cpf-valid-msg') as HTMLParagraphElement;

function maskComPontos(): boolean {
  const checked = document.querySelector<HTMLInputElement>('input[name="cpfMask"]:checked');
  return checked?.value === '1';
}

function applyCpfDisplay(rawDigits: string): void {
  const d = onlyNumbers(rawDigits).slice(0, 11);
  input.value = maskComPontos() ? formatCpfDigits(d) : d;
  input.maxLength = maskComPontos() ? 14 : 11;
  refreshCpfFieldState();
}

function refreshCpfFieldState(): void {
  const raw = onlyNumbers(input.value);
  input.classList.remove('valid', 'invalid');
  if (!raw) return;
  if (raw.length === 11) {
    input.classList.add(CPF.validar(raw) ? 'valid' : 'invalid');
  }
}

document.querySelectorAll<HTMLInputElement>('input[name="cpfMask"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    applyCpfDisplay(onlyNumbers(input.value));
  });
});

input.addEventListener('input', () => {
  const raw = onlyNumbers(input.value).slice(0, 11);
  applyCpfDisplay(raw);
});

btnGerar.addEventListener('click', async () => {
  const raw = CPF.gerarSemPontos();
  await copyToClipboard(raw);
  applyCpfDisplay(raw);
  validMsg.hidden = true;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const ok = CPF.validar(input.value);
  validMsg.textContent = ok ? 'CPF válido.' : 'CPF inválido.';
  validMsg.classList.toggle('ok', ok);
  validMsg.classList.toggle('bad', !ok);
  validMsg.hidden = false;
  refreshCpfFieldState();
});

applyCpfDisplay('');
