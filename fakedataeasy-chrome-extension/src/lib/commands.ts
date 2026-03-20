/** Nomes dos comandos — devem coincidir com `commands` no manifest.json */
export const ExtensionCommand = {
  GerarCpf: 'gerar-cpf',
  GerarCnpj: 'gerar-cnpj',
  GerarNome: 'gerar-nome',
  GerarGuid: 'gerar-guid',
  /** Abre o menu «Escolher» no campo focado (todos os frames via `executeScript`). Sem `suggested_key` no manifest — limite de 4 do Chrome. */
  AbrirMenuEscolher: 'abrir-menu-escolher',
} as const;

export type ExtensionCommandName =
  (typeof ExtensionCommand)[keyof typeof ExtensionCommand];
