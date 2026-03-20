import { ExtensionCommand } from '../lib/commands';
import { CNPJ } from '../lib/cnpj';
import { CPF } from '../lib/cpf';
import { gerarGuid } from '../lib/guid';
import { gerarNome } from '../lib/nome';
import {
  ALLOWED_SITES_STORAGE_KEY,
  ensureDefaultSitePatterns,
} from '../lib/storage-sites';
import { resyncFieldHelperScripts } from './content-scripts-registry';
import { writeTextFromServiceWorker } from './clipboard-sw';

async function bootstrap(): Promise<void> {
  await ensureDefaultSitePatterns();
  await resyncFieldHelperScripts();
}

void bootstrap();

chrome.runtime.onInstalled.addListener(() => {
  void bootstrap();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes[ALLOWED_SITES_STORAGE_KEY]) {
    void resyncFieldHelperScripts();
  }
});

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
      /* silencioso */
    }
  })();
});
