import { CpfPipe } from "src/app/pipes/cpf.pipe";
import { validateBr } from 'js-brasil';
import { StringUtils } from "src/app/utils/string-utils";

export class CPF {

    public CPF: string = '';
    public static CPFMaskWithoutMask: Array<string | RegExp> =  [/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/];

    private static GerarCPF(): string {
        const num1 = this.Random();
        const num2 = this.Random();
        const num3 = this.Random();

        const dig1 = this.Digit(num1, num2, num3, undefined);
        const dig2 = this.Digit(num1, num2, num3, dig1);
     
        const cpf =  `${num1}${num2}${num3}${dig1}${dig2}`;

        return cpf;
    }

    static GerarCPFComPontos(): string {
      
       let cpfPipe = new CpfPipe();
        let cpf = this.GerarCPF();
        return cpfPipe.transform(cpf);
    }

    static GerarCPFSemPontos(): string {
         return this.GerarCPF();
     }

    private static Digit(n1: any, n2: any, n3: any, n4: any) {

        const nums = n1.split("").concat(n2.split(""), n3.split(""));

        if (n4 !== undefined) {
            nums[9] = n4;
        }

        let x = 0;
        for (let i = (n4 !== undefined ? 11 : 10), j = 0; i >= 2; i--, j++) {
            x += parseInt(nums[j]) * i;
        }

        const y = x % 11;
        return y < 2 ? 0 : 11 - y;
    }
    private static Random(): string {
        const random = Math.floor(Math.random() * 999);
        return ("" + random).padStart(3, '0');
    }
 
    static Validar(cpf:string): boolean{
        
        if(!cpf)
        return false;
        
        cpf = StringUtils.onlyNumbers(cpf);
        return validateBr.cpf(cpf);
    }
}

