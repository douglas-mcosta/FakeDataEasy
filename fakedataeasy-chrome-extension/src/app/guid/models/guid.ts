import { Guid } from "guid-typescript";

export class GUID {

    static gerarGuid(): string{
        return Guid.create().toString();
    }
}