import { validateBr } from 'js-brasil';
import { onlyNumbers } from './string-utils';

export class CPF {
  private static randomBlock(): string {
    const n = Math.floor(Math.random() * 999);
    return String(n).padStart(3, '0');
  }

  private static digit(n1: string, n2: string, n3: string, n4: string | undefined): number {
    const nums = n1.split('').concat(n2.split(''), n3.split(''));
    if (n4 !== undefined) nums[9] = n4;

    let x = 0;
    const start = n4 !== undefined ? 11 : 10;
    for (let i = start, j = 0; i >= 2; i--, j++) {
      x += parseInt(nums[j]!, 10) * i;
    }
    const y = x % 11;
    return y < 2 ? 0 : 11 - y;
  }

  private static gerarDigitos(): string {
    const num1 = this.randomBlock();
    const num2 = this.randomBlock();
    const num3 = this.randomBlock();
    const d1 = this.digit(num1, num2, num3, undefined);
    const d2 = this.digit(num1, num2, num3, String(d1));
    return `${num1}${num2}${num3}${d1}${d2}`;
  }

  /** 11 dígitos, válido pelo algoritmo oficial */
  static gerarSemPontos(): string {
    return this.gerarDigitos();
  }

  static validar(cpf: string): boolean {
    if (!cpf) return false;
    return validateBr.cpf(onlyNumbers(cpf));
  }
}
