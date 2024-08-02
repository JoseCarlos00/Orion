console.log('[background.js]');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Print Container]');

  if (message.command === 'trabajoActivo') {
    // Obtén el ID de la pestaña activa actual
    const currentTabId = sender.tab.id;

    // Crea una nueva pestaña con la URL específica justo al lado de la pestaña actual
    chrome.tabs.create({
      url:
        'trabajos_activos/print/print.html?thead=' +
        encodeURIComponent(message.theadToPrint) +
        '&tbody=' +
        encodeURIComponent(message.tbodyToPrint),
      index: sender.tab.index + 1, // Abre la nueva pestaña al lado de la pestaña actual
      active: true, // Haz que la nueva pestaña sea la activa
    });
  }

  if (message.command === 'reporte3Cajas') {
    // Obtén el ID de la pestaña activa actual
    const currentTabId = sender.tab.id;

    // Crea una nueva pestaña con la URL específica justo al lado de la pestaña actual
    chrome.tabs.create({
      url:
        'reporte3_cajas/print/print.html?thead=' +
        encodeURIComponent(message.theadToPrint) +
        '&tbody=' +
        encodeURIComponent(message.tbodyToPrint),
      index: sender.tab.index + 1, // Abre la nueva pestaña al lado de la pestaña actual
      active: true, // Haz que la nueva pestaña sea la activa
    });
  }
});
