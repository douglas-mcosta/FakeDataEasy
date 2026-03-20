import { ExtensionCommand } from '../lib/commands';
import { CNPJ } from '../lib/cnpj';
import { CPF } from '../lib/cpf';
import { gerarGuid } from '../lib/guid';
import { gerarNome } from '../lib/nome';
import {
  FIELD_HELPER_ENABLED_KEY,
  ensureFieldHelperDefaults,
} from '../lib/storage-field-helper';
import {
  ALLOWED_SITES_STORAGE_KEY,
  ensureDefaultSitePatterns,
} from '../lib/storage-sites';
import { resyncFieldHelperScripts } from './content-scripts-registry';
import { writeTextFromServiceWorker } from './clipboard-sw';

async function bootstrap(): Promise<void> {
  await ensureDefaultSitePatterns();
  await ensureFieldHelperDefaults();
  await resyncFieldHelperScripts();
}

void bootstrap();

chrome.runtime.onInstalled.addListener(() => {
  void bootstrap();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;
  if (changes[ALLOWED_SITES_STORAGE_KEY] || changes[FIELD_HELPER_ENABLED_KEY]) {
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
    if (command === ExtensionCommand.AbrirMenuEscolher) {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id === undefined) return;
        await chrome.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          func: () => {
            document.dispatchEvent(new CustomEvent('fde-open-choose-menu'));
          },
        });
      } catch {
        /* sem permissão, separador interno ou sem content script injectado */
      }
      return;
    }
    const text = textoParaComando(command);
    if (text === null) return;
    try {
      await writeTextFromServiceWorker(text);
    } catch {
      /* silencioso */
    }
  })();
});
