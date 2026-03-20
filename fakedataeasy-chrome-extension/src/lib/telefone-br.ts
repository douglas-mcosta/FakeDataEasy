/** Celular BR 11 dígitos (DDD + 9 + 8 dígitos), apenas para testes de formulário. */
export function gerarTelefoneCelularBR(): string {
  const ddd = String(Math.floor(Math.random() * 89) + 11);
  const sufixo = String(Math.floor(Math.random() * 1e8)).padStart(8, '0');
  return `${ddd}9${sufixo}`;
}
