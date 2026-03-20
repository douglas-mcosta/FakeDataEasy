import { validateBr } from 'js-brasil';
import { onlyNumbers } from './string-utils';

export class CNPJ {
  private static gerarRandom(n: number): number {
    return Math.round(Math.random() * n);
  }

  private static mod(dividendo: number, divisor: number): number {
    return Math.round(dividendo - Math.floor(dividendo / divisor) * divisor);
  }

  /** 14 dígitos (mesmo algoritmo da versão Angular) */
  static gerarSemPontos(): string {
    const n = 9;
    const n1 = this.gerarRandom(n);
    const n2 = this.gerarRandom(n);
    const n3 = this.gerarRandom(n);
    const n4 = this.gerarRandom(n);
    const n5 = this.gerarRandom(n);
    const n6 = this.gerarRandom(n);
    const n7 = this.gerarRandom(n);
    const n8 = this.gerarRandom(n);
    const n9 = 0;
    const n10 = 0;
    const n11 = 0;
    const n12 = 1;
    let d1 =
      n12 * 2 +
      n11 * 3 +
      n10 * 4 +
      n9 * 5 +
      n8 * 6 +
      n7 * 7 +
      n6 * 8 +
      n5 * 9 +
      n4 * 2 +
      n3 * 3 +
      n2 * 4 +
      n1 * 5;
    d1 = 11 - this.mod(d1, 11);
    if (d1 >= 10) d1 = 0;
    let d2 =
      d1 * 2 +
      n12 * 3 +
      n11 * 4 +
      n10 * 5 +
      n9 * 6 +
      n8 * 7 +
      n7 * 8 +
      n6 * 9 +
      n5 * 2 +
      n4 * 3 +
      n3 * 4 +
      n2 * 5 +
      n1 * 6;
    d2 = 11 - this.mod(d2, 11);
    if (d2 >= 10) d2 = 0;
    return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${n10}${n11}${n12}${d1}${d2}`;
  }

  static validar(cnpj: string): boolean {
    if (!cnpj) return false;
    return validateBr.cnpj(onlyNumbers(cnpj));
  }
}
