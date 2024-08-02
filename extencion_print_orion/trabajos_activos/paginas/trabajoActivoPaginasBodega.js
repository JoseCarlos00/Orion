console.log('[Trabajos Activos Print Paginas]');

async function main() {
  try {
    await insertElementPrint();

    setEventForPint();
  } catch (error) {
    console.error('Error:', error);
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
      <div class="p-2 bd-highlight">
        <button id="printButtonTrabajoActivo" type="button" class="btn btn-sm text-grey btn-purple mt-3"><i class="fas fa-print"></i>Imprimir</button>
      </div>
      `;

    const elementoForToInsert = document.querySelector(
      '#Panel15 > main > div.row > div > div.d-flex.bd-highlight.mb-3'
    );

    const elementDelete = document.querySelector(
      '#Panel15 > main > div.row > div > div.d-flex.bd-highlight.mb-3 > div:nth-child(1)'
    );

    elementDelete && elementDelete.remove();

    if (elementoForToInsert) {
      elementoForToInsert.insertAdjacentHTML('beforeend', buttonPrint);
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

    eliminarMensajeDeImpresionIncompleto();
  } catch (error) {
    console.error('Error:', error);
  }
}

function verificarLineas() {
  console.log('[verificarLineas] se ha ejecutado');

  return new Promise(resolve => {
    const totalNumber = obtenerTotalNumber();
    const numFilas = obtenerNumFilas();

    if (numFilas === null || totalNumber === null) {
      console.warn('Error al obtener el número de filas o el total.');
      alert('Ha ocurrido un error inesperado');
      resolve(false);
      return;
    }

    if (esImpresionCompleta(numFilas, totalNumber)) {
      alert('Ha ocurrido un error inesperado');
      resolve(false);
      return;
    }

    manejarFilasIncompletas(numFilas, totalNumber).then(resolve);
  });

  function manejarFilasIncompletas(numFilas, totalNumber) {
    return new Promise(resolve => {
      if (numFilas <= totalNumber) {
        const userResponse = confirm(
          '❌ No están activadas todas las líneas\n' +
            '¿Desea continuar?\n' +
            '     ⚠️                                                                      Sí        /        No'
        );

        if (userResponse) {
          resolve(false); // El usuario decide continuar
          insertarMessageIncompletePrint();
        } else {
          activarFilas = true;
          console.log('activarFilas = true');
          setTimeout(activartodasLasLineas, 50);
          resolve(true); // El usuario decide no continuar
        }
      } else {
        resolve(false); // El número de filas es mayor al total
      }
    });
  }
}

window.addEventListener('load', main, { once: true });
