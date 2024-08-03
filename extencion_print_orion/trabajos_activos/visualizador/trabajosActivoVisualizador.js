console.log('[Trbajos Activos Print Visualizador]');

async function main() {
  try {
    const linkSelected = document.querySelector(
      '#RMReportes > ul > li:nth-child(2) > div > ul > li.rmItem.rmLast > a'
    );

    if (linkSelected) {
      // Verifica si el elemento tiene la clase 'rmSelected'
      const selected = linkSelected.classList.contains('rmSelected');

      // Lanza un error si no se encuentra la clase
      if (!selected) {
        throw new Error('No se encontró el reporte seleccionado');
      }
    } else {
      // Lanza un error si el elemento no existe
      throw new Error('No se encontró el elemento especificado');
    }

    addClassToElement('html', 'impresion-active');
    await insertElementPrintVisualizador();

    setEventForPintVisualizador();
  } catch (error) {
    console.error(error);
  } finally {
    alertPrintTrabajosActivos();
  }
}

function setEventForPintVisualizador() {
  // Escucha el evento clic en el botón print
  const printButton = document.getElementById('printButtonTrabajoActivo');
  if (!printButton) return;
  printButton.addEventListener('click', getDataForToPrint);
}

function insertElementPrintVisualizador() {
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

window.addEventListener('load', main, { once: true });
