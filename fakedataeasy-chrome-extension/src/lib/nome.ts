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

const SOBRENOMES = [
  'Silva',
  'Santos',
  'Oliveira',
  'Souza',
  'Rodrigues',
  'Ferreira',
  'Alves',
  'Pereira',
  'Lima',
  'Gomes',
  'Costa',
  'Ribeiro',
  'Martins',
  'Carvalho',
  'Rocha',
  'Almeida',
  'Nascimento',
  'Araújo',
  'Mel',
  'Barbosa',
  'Dias',
  'Monteiro',
  'Mendes',
  'Freitas',
  'Cardoso',
  'Reis',
  'Fernandes',
  'Teixeira',
  'Moreira',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/** Nome próprio (gerador-nome) + um ou dois sobrenomes comuns no Brasil. */
export function gerarNomeCompleto(masculino: boolean): string {
  const first = masculino ? geradorNomeMasculino() : geradorNomeFeminino();
  const doisSobrenomes = Math.random() < 0.55;
  const s1 = pick(SOBRENOMES);
  if (!doisSobrenomes) return `${first} ${s1}`;
  let s2 = pick(SOBRENOMES);
  let guard = 0;
  while (s2 === s1 && guard++ < 8) s2 = pick(SOBRENOMES);
  return `${first} ${s1} ${s2}`;
}
