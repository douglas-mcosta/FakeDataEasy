/** E-mail fictício para testes (domínio reservado para documentação). */
export function gerarEmailFake(): string {
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  return `teste.${id}@example.com`;
}
