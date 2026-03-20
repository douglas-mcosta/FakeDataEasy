import type { BackgroundToOffscreenMessage } from './messages';

let offscreenBootstrap: Promise<void> | null = null;

/**
 * Garante um documento offscreen com motivo CLIPBOARD.
 * Após o primeiro createDocument, aguarda um pouco para o módulo registar `onMessage`
 * (evita a primeira mensagem perdida).
 */
async function ensureOffscreenDocument(): Promise<void> {
  if (await chrome.offscreen.hasDocument()) return;

  if (!offscreenBootstrap) {
    offscreenBootstrap = (async () => {
      try {
        await chrome.offscreen.createDocument({
          url: 'offscreen/offscreen.html',
          reasons: [chrome.offscreen.Reason.CLIPBOARD],
          justification:
            'Escrever na área de transferência quando o utilizador dispara atalhos globais (comandos da extensão).',
        });
        await new Promise((r) => setTimeout(r, 150));
      } catch (err) {
        offscreenBootstrap = null;
        throw err;
      }
    })();
  }

  await offscreenBootstrap;
}

function copyViaOffscreenDocument(text: string): Promise<boolean> {
  const payload: BackgroundToOffscreenMessage = {
    type: 'COPY_TO_CLIPBOARD',
    text,
  };

  return new Promise((resolve) => {
    chrome.runtime.sendMessage(payload, (response: { ok?: boolean } | undefined) => {
      if (chrome.runtime.lastError) {
        resolve(false);
        return;
      }
      resolve(Boolean(response?.ok));
    });
  });
}

/**
 * Não use `navigator.clipboard` no service worker: costuma falhar com “Document is not focused”
 * mesmo com a permissão `clipboardWrite`. O fluxo suportado é via documento offscreen.
 *
 * @see https://stackoverflow.com/questions/78555143/chrome-extension-error-failed-to-execute-writetext-on-clipboard-document-is-not-focused
 */
export async function writeTextFromServiceWorker(text: string): Promise<void> {
  await ensureOffscreenDocument();

  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, 60 * attempt));
    }
    if (await copyViaOffscreenDocument(text)) {
      return;
    }
  }

  throw new Error('Não foi possível copiar para a área de transferência.');
}
