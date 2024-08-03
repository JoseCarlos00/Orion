console.log('[Trabajos Activos Print Paginas]');

async function main() {
  try {
    const linkSelected = document.querySelector(
      '#RMReportes > ul > li:nth-child(2) > div > ul > li:nth-child(3) > a'
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
    await insertElementPrintPaginas();

    setEventForPintPaginas();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    alertPrintTrabajosActivos();
  }
}

function setEventForPintPaginas() {
  // Escucha el evento clic en el botón print
  const printButton = document.getElementById('printButtonTrabajoActivo');
  if (!printButton) return;
  printButton.addEventListener('click', getDataForToPrint);
}

function insertElementPrintPaginas() {
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

window.addEventListener('load', main, { once: true });
