import { ExtensionCommand } from '../lib/commands';
import { CNPJ } from '../lib/cnpj';
import { CPF } from '../lib/cpf';
import { gerarGuid } from '../lib/guid';
import { gerarNome } from '../lib/nome';
import { writeTextFromServiceWorker } from './clipboard-sw';

function textoParaComando(command: string): string | null {
  switch (command) {
    case ExtensionCommand.GerarCpf:
      return CPF.gerarSemPontos();
    case ExtensionCommand.GerarCnpj:
      return CNPJ.gerarSemPontos();
    case ExtensionCommand.GerarNome:
      return gerarNome();
    case ExtensionCommand.GerarGuid:
      return gerarGuid();
    default:
      return null;
  }
}

chrome.commands.onCommand.addListener((command) => {
  void (async () => {
    const text = textoParaComando(command);
    if (text === null) return;
    try {
      await writeTextFromServiceWorker(text);
    } catch {
      /* Evitar exceção não tratada no SW; opcional: notificação futura */
    }
  })();
});
