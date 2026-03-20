import { copyToClipboard } from '../src/lib/clipboard';
import {
  gerarNomeFeminino,
  gerarNomeMasculino,
} from '../src/lib/nome';

document.documentElement.lang = 'pt-BR';

const input = document.getElementById('nome-input') as HTMLInputElement;
const btnGerar = document.getElementById('nome-gerar') as HTMLButtonElement;

function masculino(): boolean {
  const checked = document.querySelector<HTMLInputElement>('input[name="nomeGen"]:checked');
  return checked?.value === '1';
}

btnGerar.addEventListener('click', async () => {
  const nome = masculino() ? gerarNomeMasculino() : gerarNomeFeminino();
  input.value = nome;
  await copyToClipboard(nome);
});
