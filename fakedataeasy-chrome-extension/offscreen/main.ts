/**
 * Documento offscreen: o service worker não tem documento focado, por isso o Clipboard API
 * falha lá. Aqui temos um documento real; usamos writeText e, se necessário, execCommand.
 */
import type { BackgroundToOffscreenMessage } from '../src/background/messages';

function copyWithExecCommand(text: string): boolean {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  ta.style.top = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } finally {
    document.body.removeChild(ta);
  }
  return ok;
}

chrome.runtime.onMessage.addListener(
  (message: BackgroundToOffscreenMessage, _sender, sendResponse) => {
    if (message?.type !== 'COPY_TO_CLIPBOARD' || typeof message.text !== 'string') {
      return;
    }

    void (async () => {
      try {
        await navigator.clipboard.writeText(message.text);
        sendResponse({ ok: true as const });
        return;
      } catch {
        /* continua */
      }
      const ok = copyWithExecCommand(message.text);
      sendResponse({ ok: ok ? (true as const) : (false as const) });
    })();

    return true;
  },
);
