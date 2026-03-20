/**
 * Abre a página de configurações (sites, tema) num separador.
 * Usa `tabs.create`; se falhar, tenta `runtime.openOptionsPage`.
 */
export function openExtensionSettingsPage(): void {
  const url = chrome.runtime.getURL('options/options.html');
  chrome.tabs.create({ url }, () => {
    if (chrome.runtime.lastError) {
      void chrome.runtime.openOptionsPage();
    }
  });
}
