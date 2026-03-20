/** Nomes dos comandos — devem coincidir com `commands` no manifest.json */
export const ExtensionCommand = {
  GerarCpf: 'gerar-cpf',
  GerarCnpj: 'gerar-cnpj',
  GerarNome: 'gerar-nome',
  GerarGuid: 'gerar-guid',
} as const;

export type ExtensionCommandName =
  (typeof ExtensionCommand)[keyof typeof ExtensionCommand];
