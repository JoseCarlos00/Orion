async function getDataForToPrint() {
  try {
    const continuar = await verificarLineas();

    if (continuar) {
      console.warn('❗ La impresion se ha setenido');
      return;
    }

    // Lógica para obtener el contenido a imprimir de la página actual
    const theadToPrint = document.querySelector('#gvTrabajoActivoV3_ctl00 > thead');
    const tbodyToPrint = document.querySelector('#gvTrabajoActivoV3_ctl00 > tbody');

    if (!tbodyToPrint || !theadToPrint) return;

    // Envía un mensaje al script de fondo para solicitar la apertura de una nueva pestaña
    if (chrome.runtime && tbodyToPrint && theadToPrint) {
      chrome.runtime.sendMessage({
        command: 'trabajoActivo',
        theadToPrint: theadToPrint.innerHTML,
        tbodyToPrint: tbodyToPrint.innerHTML,
      });
    }

    eliminarMensajeDeImpresionIncompleto();
  } catch (error) {
    console.error('Error:', error);
  }
}
