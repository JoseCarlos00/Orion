async function getDataForToPrint() {
  try {
    const continuar = await verificarLineas();

    if (continuar) {
      console.warn('❗ La impresion se ha setenido');
      return;
    }

    // Lógica para obtener el contenido a imprimir de la página actual
    const theadToPrint = document.querySelector('#gvPedidosTienda_ctl00 > thead');
    const tbodyToPrint = document.querySelector('#gvPedidosTienda_ctl00 > tbody');

    if (!tbodyToPrint || !theadToPrint) {
      console.error('No se encontro el [thead] and [tbody]');
      return;
    }

    // Envía un mensaje al script de fondo para solicitar la apertura de una nueva pestaña
    if (chrome.runtime && tbodyToPrint && theadToPrint) {
      chrome.runtime.sendMessage({
        command: 'reporte3Cajas',
        theadToPrint: theadToPrint.innerHTML,
        tbodyToPrint: tbodyToPrint.innerHTML,
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
