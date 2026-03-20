import { getAllowedPatterns } from '../lib/storage-sites';

export const FIELD_HELPER_SCRIPT_ID = 'fde-field-helper';

/** Evita corridas: bootstrap + onInstalled + storage.onChanged podem disparar resync em paralelo. */
let resyncQueue: Promise<void> = Promise.resolve();

async function patternsWithPermission(patterns: string[]): Promise<string[]> {
  const permitted: string[] = [];
  for (const p of patterns) {
    try {
      if (await chrome.permissions.contains({ origins: [p] })) {
        permitted.push(p);
      }
    } catch {
      /* origem inválida */
    }
  }
  return permitted;
}

function isDuplicateScriptIdError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  return /duplicate script id/i.test(msg);
}

async function runResyncFieldHelperScripts(): Promise<void> {
  const raw = await getAllowedPatterns();
  const patterns = await patternsWithPermission(raw);

  let registered: chrome.scripting.RegisteredContentScript[] = [];
  try {
    registered = await chrome.scripting.getRegisteredContentScripts({
      ids: [FIELD_HELPER_SCRIPT_ID],
    });
  } catch {
    /* ignorar */
  }
  const exists = registered.some((s) => s.id === FIELD_HELPER_SCRIPT_ID);

  if (patterns.length === 0) {
    if (exists) {
      await chrome.scripting.unregisterContentScripts({ ids: [FIELD_HELPER_SCRIPT_ID] });
    }
    return;
  }

  const scriptDef: chrome.scripting.RegisteredContentScript = {
    id: FIELD_HELPER_SCRIPT_ID,
    matches: patterns,
    js: ['content/field-helper.js'],
    runAt: 'document_idle',
  };

  if (exists) {
    await chrome.scripting.updateContentScripts([scriptDef]);
    return;
  }

  try {
    await chrome.scripting.registerContentScripts([scriptDef]);
  } catch (e) {
    if (isDuplicateScriptIdError(e)) {
      await chrome.scripting.updateContentScripts([scriptDef]);
      return;
    }
    throw e;
  }
}

export function resyncFieldHelperScripts(): Promise<void> {
  const done = resyncQueue.then(() => runResyncFieldHelperScripts());
  resyncQueue = done.catch(() => undefined);
  return done;
}
