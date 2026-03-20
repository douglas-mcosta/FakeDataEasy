/**
 * CEPs reais (8 dígitos) por região — amostras públicas para testes de formulário.
 * Formato: só dígitos; usar `formatarCep` para máscara 00000-000.
 */
export type CepRegiao =
  | 'qualquer'
  | 'sp_capital'
  | 'rj_capital'
  | 'mg_bh'
  | 'pr_curitiba'
  | 'ba_salvador'
  | 'rs_porto_alegre'
  | 'df_brasilia'
  | 'pe_recife'
  | 'ce_fortaleza'
  | 'sc_florianopolis';

export const CEP_REGIAO_LABEL: Record<CepRegiao, string> = {
  qualquer: 'Qualquer região (misturado)',
  sp_capital: 'São Paulo — capital',
  rj_capital: 'Rio de Janeiro — capital',
  mg_bh: 'Belo Horizonte',
  pr_curitiba: 'Curitiba',
  ba_salvador: 'Salvador',
  rs_porto_alegre: 'Porto Alegre',
  df_brasilia: 'Brasília',
  pe_recife: 'Recife',
  ce_fortaleza: 'Fortaleza',
  sc_florianopolis: 'Florianópolis',
};

const POOL: Record<Exclude<CepRegiao, 'qualquer'>, string[]> = {
  sp_capital: ['01310100', '01311000', '01415000', '03115000', '04038002', '04567001', '05407002', '05508000'],
  rj_capital: ['20040020', '20221050', '22250040', '22041001', '20511030', '22451090'],
  mg_bh: ['30130100', '30310190', '30575130', '31030002', '30112000'],
  pr_curitiba: ['80010000', '80420210', '80530240', '81210250'],
  ba_salvador: ['40015909', '40210000', '41820320', '40301000'],
  rs_porto_alegre: ['90010150', '90570020', '91010020', '91530000'],
  df_brasilia: ['70040020', '70710500', '71215532', '71680307'],
  pe_recife: ['50010000', '50030030', '52011240', '51020220'],
  ce_fortaleza: ['60060170', '60165121', '60410550', '60810350'],
  sc_florianopolis: ['88010001', '88015600', '88020600', '88032200'],
};

let cachedTodos: string[] | null = null;

function todosOsCeps(): string[] {
  if (!cachedTodos) {
    cachedTodos = [...new Set((Object.values(POOL) as string[][]).flat())];
  }
  return cachedTodos;
}

export function cepsDisponiveis(regiao: CepRegiao): string[] {
  if (regiao === 'qualquer') return [...todosOsCeps()];
  return [...POOL[regiao]];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/** Apenas 8 dígitos. */
export function gerarCepDigitos(regiao: CepRegiao): string {
  const pool = cepsDisponiveis(regiao);
  return pick(pool);
}

export function formatarCep(digitos8: string, comHifen: boolean): string {
  const d = digitos8.replace(/\D/g, '').slice(0, 8);
  if (d.length !== 8) return digitos8;
  return comHifen ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export function gerarCep(regiao: CepRegiao, comHifen: boolean): string {
  return formatarCep(gerarCepDigitos(regiao), comHifen);
}
