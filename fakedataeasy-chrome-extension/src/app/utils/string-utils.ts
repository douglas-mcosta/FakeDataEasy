export class StringUtils {
    
    public static onlyNumbersRegex = [/[^0-9]/g,''];

    public static isNullOrEmpty(val: string) : boolean {
        if (val === undefined || val === null || val.trim() === '') {
            return true;
        }
        return false;
    };

    public static onlyNumbers(numero: string) : string {
        return numero.replace(/[^0-9]/g,'');
    }

   public static CopyToClipboard(cpf: string): void{

        var tempInput = document.createElement("input");
        tempInput.value = cpf;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

    }
}
