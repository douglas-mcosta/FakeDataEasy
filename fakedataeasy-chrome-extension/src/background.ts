import { CNPJ } from "./app/cnpj/models/cnpj";
import { CPF } from "./app/cpf/models/cpf";
import { GUID } from "./app/guid/models/guid";
import { CommandType } from "./app/models/commandType-enum";
import { NOME } from "./app/nome/models/nome";
import { StringUtils } from "./app/utils/string-utils";

chrome.commands.onCommand.addListener(async function (command) {
    if(command === CommandType.GerarCpf){
        let cpf = CPF.GerarCPFSemPontos();
        StringUtils.CopyToClipboard(cpf);
    }

    if(command === CommandType.GerarCnpj){
        let cnpj = CNPJ.GerarCNPJ();
        StringUtils.CopyToClipboard(cnpj);
    }

    if(command === CommandType.GerarNome){
        let nome = NOME.GerarNome();
        StringUtils.CopyToClipboard(nome);
    }

    if(command === CommandType.GerarGuid){
        let guid = GUID.gerarGuid();
        StringUtils.CopyToClipboard(guid);
    }
});
