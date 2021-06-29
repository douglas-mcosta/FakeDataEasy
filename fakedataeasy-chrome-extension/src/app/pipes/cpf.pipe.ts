import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'CPF'
})

export class CpfPipe implements PipeTransform{
    transform(value: string) {
        const cpf1 = value.substr(0,3);
        const cpf2 = value.substr(2,3);
        const cpf3 = value.substr(5,3);
        const cpf4 = value.substr(8,2);

        return `${cpf1}.${cpf2}.${cpf3}-${cpf4}`
    }
}