/** Inventario Bodega Separado N */

async function main() {
  /** Banderas Globales */
  let activarFilas = false;
  let isVerificarLineasDeImpresionExecuted = false;

  try {
    /** Isertar Button Imprimir */
    await insertarButtonPrint();

    const printButtonInventory = document.querySelector('#printButtonInventory');
    printButtonInventory &&
      printButtonInventory.addEventListener('click', verificarLineasDeImpresion);

    /** Inserar Enlace */
    const body = document.querySelector('body');
    const enlace =
      '<a href="#gvInventario_ctl00_ctl03_ctl01_PageSizeComboBox_Input" id="irALista" hidden="">Ir a Lista</a>';

    body && body.insertAdjacentHTML('afterbegin', enlace);

    const tdFoot = document.querySelector('#gvInventario_ctl00 > tfoot > tr > td');
    tdFoot && tdFoot.setAttribute('colspan', 24);

    /** Insertar Eventos de Impresion */
    window.addEventListener('beforeprint', verificarLineasDeImpresion);
    window.addEventListener('afterprint', activartodasLasLineas);

    document.addEventListener('keydown', function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        console.warn('¡Has presionado Ctrl + P!');
        event.preventDefault(); // Prevenir la acción predeterminada de imprimir la página

        verificarLineasDeImpresion();
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }

  function insertarButtonPrint() {
    const buttonPrint = `
      <div >
          <button id="printButtonInventory" type="button" class="btn btn-sm btn-purple"><i class="fas fa-print"></i>Imprimir</button>
      </div>
      `;

    return new Promise(resolve => {
      const elementoInsert = document.querySelector(
        '#frmInventarioSeparado > main > div.row > div > div > div.card-table > div.form-inline'
      );

      if (elementoInsert) {
        elementoInsert.classList.add('container-print');
        elementoInsert.children[0].classList.remove('col');

        elementoInsert.insertAdjacentHTML('beforeend', buttonPrint);

        resolve(true);
      } else {
        console.log(new Error('No se encontroe el elemento a insertar: Button Print'));
        resolve(false);
      }
    });
  }

  function verificarLineasDeImpresion() {
    if (isVerificarLineasDeImpresionExecuted) {
      console.log(
        'Return: isVerificarLineasDeImpresionExecuted:',
        isVerificarLineasDeImpresionExecuted
      );
      return;
    }

    isVerificarLineasDeImpresionExecuted = true;
    console.log('verificarLineasDeImpresion se ha ejecutado');

    const totalNumber = obtenerTotalNumber();
    const numFilas = obtenerNumFilas();

    if (numFilas === null || totalNumber === null) {
      console.warn('Error al obtener el número de filas o el total.');
      return;
    }

    if (esImpresionCompleta(numFilas, totalNumber)) {
      window.print();
      return;
    }

    manejarImpresionIncompleta(numFilas, totalNumber);
  }

  function obtenerTotalNumber() {
    const totalElement = document.querySelector(
      '#gvInventario_ctl00 > tfoot > tr > td > table > tbody > tr > td > div.rgWrap.rgInfoPart > strong'
    );

    return totalElement ? Number(totalElement.textContent.trim()) : null;
  }

  function obtenerNumFilas() {
    const numFilasElements = document.querySelectorAll('#gvInventario_ctl00 > tbody > tr');
    const noRegistrosElement = document.querySelector('#gvInventario_ctl00 > tbody tr td');

    const noRegistrosText = noRegistrosElement ? noRegistrosElement.textContent.trim() : '';
    const numTotalFilas = numFilasElements.length;

    // Si el texto en noRegistrosElement contiene "No contiene Registros", entonces retornamos 0
    if (noRegistrosText.includes('No contiene Registros')) {
      return 0;
    }

    return Number(numTotalFilas);
  }

  function esImpresionCompleta(numFilas, totalNumber) {
    if (numFilas === totalNumber || (numFilas === 0 && totalNumber === 0)) {
      console.warn('El total de filas  === 0 y total === 0\n\t\t\tOR\n numfilas === totalNumber');
      return true;
    }
    return false;
  }

  function manejarImpresionIncompleta(numFilas, totalNumber) {
    if (!(numFilas < totalNumber)) return;

    const userResponse = confirm(
      '❌Impresión incompleta\n' +
        '❕Active todas las líneas\n' +
        '¿Desea continuar con la impresión?\n' +
        '     ⚠️                                                                      Sí        /        No'
    );

    if (userResponse) {
      insertarMessageIncompletePrint()
        .then(() => {
          window.print();
        })
        .catch(err => {
          console.error('Error:', err);
          window.print();
        });
    } else {
      activarFilas = true;
      console.log('activarFilas = true');
      setTimeout(activartodasLasLineas, 50);
    }
  }

  function activartodasLasLineas() {
    isVerificarLineasDeImpresionExecuted = false;

    eliminarMensajeDeImpresionIncompleto();

    if (!isActivarFilasValido()) {
      return;
    }

    activarFilas = false;
    clickBtnIrALista();
    activarFilasLista();

    function isActivarFilasValido() {
      if (typeof activarFilas === 'undefined' || !activarFilas) {
        console.warn('No existe la variable activarFilas\n\t\tOR\n es false');
        return false;
      }
      return true;
    }
  }

  function clickBtnIrALista() {
    const btnIrALista = document.querySelector('#irALista');
    if (btnIrALista) {
      btnIrALista.click();
    } else {
      console.warn('El botón #irALista no se encontró.');
    }
  }

  function activarFilasLista() {
    const listaDeActivarFilas = document.querySelector(
      '#gvInventario_ctl00_ctl03_ctl01_PageSizeComboBox > table tbody tr.rcbReadOnly'
    );

    if (!listaDeActivarFilas) {
      console.warn('La lista de filas activas no se encontró.');
      return;
    }

    listaDeActivarFilas.addEventListener('click', () => {
      listaDeActivarFilas.classList.remove('bounce-active');
    });

    setTimeout(() => {
      listaDeActivarFilas.classList.add('bounce-active');
    }, 100);
  }

  function insertarMessageIncompletePrint() {
    const htmlTrPrint = `
      <tr id="incompletePrint">
         <td colspan="21"><h4 style="text-align: center;">Impresion Incompleta</h4></td>
      </tr>
    `;

    return new Promise(resolve => {
      const tbody = document.querySelector('#gvInventario_ctl00 > tbody');

      if (!tbody) {
        console.error('Error: no se encontro el elemento [tbody]');
        resolve();
        return;
      }

      const incompletePrintTr = document.querySelector('#incompletePrint');

      if (!incompletePrintTr) {
        tbody.insertAdjacentHTML('beforeend', htmlTrPrint);
      }

      resolve();
    });
  }

  function eliminarMensajeDeImpresionIncompleto() {
    const incompletePrintTr = document.querySelector('#incompletePrint');

    if (incompletePrintTr) {
      incompletePrintTr.remove();
    }
  }
}

window.addEventListener('load', main, { once: true });
