import { CPF } from "./app/cpf/models/cpf";
import { CommandType } from "./app/models/commandType-enum";

chrome.commands.onCommand.addListener(async function (command) {
    if(command === CommandType.GerarCpf){
        let cpf = CPF.GenerateCPFWithPoints();
        CPF.CopyToClipboard(cpf);
        // console.log(cpf);
    }
});
