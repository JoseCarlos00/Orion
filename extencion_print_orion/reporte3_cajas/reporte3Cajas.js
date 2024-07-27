async function main() {
  /** Banderas Globales */
  let activarFilas = false;
  let isVerificarLineasDeImpresionExecuted = false;

  try {
    /** Isertar Button Imprimir */
    await insertarButtonPrint();

    setEventsListeners();

    /** Inserar Enlace */
    const body = document.querySelector('body');
    const enlace =
      '<a href="#gvPedidosTienda_ctl00_ctl03_ctl01_PageSizeComboBox_Arrow" id="irALista" hidden="">Ir a Lista</a>';

    body && body.insertAdjacentHTML('afterbegin', enlace);
  } catch (error) {
    console.error('Error:', error);
  }

  function insertarButtonPrint() {
    const buttonPrint = `
      <div class="p-2 bd-highlight">
          <button id="printButtonInventory" type="button" class="btn btn-sm btn-purple mt-3"><i class="fas fa-print"></i>Imprimir</button>
      </div>
      `;

    return new Promise(resolve => {
      const elementoInsert = document.querySelector(
        '#frmReciboListas > main > div.row > div > div.d-flex.bd-highlight.mb-3 > div:nth-child(1)'
      );

      if (elementoInsert) {
        elementoInsert.insertAdjacentHTML('afterend', buttonPrint);

        resolve(true);
      } else {
        console.log(new Error('No se encontroe el elemento a insertar: Button Print'));
        resolve(false);
      }
    });
  }

  function setEventsListeners() {
    const printButtonInventory = document.querySelector('#printButtonInventory');
    printButtonInventory &&
      printButtonInventory.addEventListener('click', verificarLineasDeImpresion);

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
    const numFilasElementSelector =
      '#gvPedidosTienda_ctl00 > tfoot > tr > td > table > tbody > tr > td > div.rgWrap.rgInfoPart > strong:nth-child(1)';
    const totalElement = document.querySelector(numFilasElementSelector);
    return totalElement ? Number(totalElement.textContent.trim()) : null;
  }

  function obtenerNumFilas() {
    const numFilasElements = document.querySelectorAll('#gvPedidosTienda_ctl00 > tbody tr');
    return numFilasElements.length;
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
    const listaDeActivarFilasIunput = document.querySelector(
      '#gvPedidosTienda_ctl00_ctl03_ctl01_PageSizeComboBox_Input'
    );

    if (!listaDeActivarFilasIunput) {
      console.warn('La lista de filas activas input no se encontró.');
      return;
    }

    const listaDeActivarFilas = listaDeActivarFilasIunput.closest('tr.rcbReadOnly');
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
      const tbody = document.querySelector('#gvPedidosTienda_ctl00 > tbody');

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
