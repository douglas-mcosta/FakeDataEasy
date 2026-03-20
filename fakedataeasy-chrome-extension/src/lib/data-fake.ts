/** Data ISO (YYYY-MM-DD) pseudo-aleatória no passado recente — só para testes. */
export function gerarDataIsoAleatoria(anosParaTras = 50): string {
  const fim = Date.now();
  const inicio = fim - anosParaTras * 365.25 * 24 * 60 * 60 * 1000;
  const t = inicio + Math.random() * (fim - inicio);
  return new Date(t).toISOString().slice(0, 10);
}
