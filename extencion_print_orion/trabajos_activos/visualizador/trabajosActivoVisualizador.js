console.log('[Trbajos Activos Print Visualizador]');

async function main() {
  try {
    await insertElementPrint();

    setEventForPint();
  } catch (error) {
    console.error(error);
  } finally {
    alertPrintTrabajosActivos();
  }
}

function setEventForPint() {
  // Escucha el evento clic en el botón print
  const printButton = document.getElementById('printButtonTrabajoActivo');
  if (!printButton) return;
  printButton.addEventListener('click', getDataForToPrint);
}

function insertElementPrint() {
  return new Promise((resolve, reject) => {
    const buttonPrint = `
      <div class="d-flex bd-highlight">
        <div class="p-2 bd-highlight">
          <button id="printButtonTrabajoActivo" type="button" class="btn btn-sm text-grey btn-purple mt-3"><i class="fas fa-print" aria-hidden="true"></i>Imprimir</button>
        </div>
      </div>
      `;

    const elementoForToInsert = document.querySelector(
      '#Panel15 > main > div.d-flex.justify-content-center'
    );

    if (elementoForToInsert) {
      elementoForToInsert.insertAdjacentHTML('afterend', buttonPrint);
      resolve();
    } else {
      reject('No se encontro el elemento a insertar');
    }
  });
}

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
  } catch (error) {
    console.error('Error:', error);
  }
}
window.addEventListener('load', main, { once: true });
