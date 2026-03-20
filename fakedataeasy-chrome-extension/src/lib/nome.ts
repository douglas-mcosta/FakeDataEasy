import {
  geradorNome,
  geradorNomeFeminino,
  geradorNomeMasculino,
} from 'gerador-nome';

/** Mistura (atalho / menu principal) */
export function gerarNome(): string {
  return geradorNome();
}

export function gerarNomeMasculino(): string {
  return geradorNomeMasculino();
}

export function gerarNomeFeminino(): string {
  return geradorNomeFeminino();
}
