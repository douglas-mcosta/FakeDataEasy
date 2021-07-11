import { geradorNome, geradorNomeFeminino, geradorNomeMasculino } from "gerador-nome";

export class NOME {

    static GerarNome(): string {

        return geradorNome();
    }
    static GerarNomeMasculino(): string {

        return geradorNomeMasculino();
    }

    static GerarNomeFeminimo(): string {

        return geradorNomeFeminino();
    }
}