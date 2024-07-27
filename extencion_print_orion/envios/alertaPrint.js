async function alertaPrint() {
  /** Banderas Globales */
  let activarFilas = false;
  let isVerificarLineasDeImpresionExecuted = false;

  try {
    setEventsListener();

    /** Inserar Enlace */
    const body = document.querySelector('body');
    const enlace =
      '<a href="#gvEnvio_ctl00_ctl03_ctl01_PageSizeComboBox_Input" id="irALista" hidden="">Ir a Lista</a>';

    body && body.insertAdjacentHTML('afterbegin', enlace);
  } catch (error) {
    console.error('Error:', error);
  }

  function setEventsListener() {
    const printButtonEnvio = document.querySelector('#printButtonEnvio');
    printButtonEnvio && printButtonEnvio.addEventListener('click', verificarLineasDeImpresion);

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
    const selector =
      '#gvEnvio_ctl00 > tfoot > tr > td > table > tbody > tr > td > div.rgWrap.rgInfoPart';
    const totalElement = document.querySelector(selector);

    // Obtener el contenido del elemento
    const text = totalElement ? totalElement.textContent.trim() : '';
    const match = text.match(/^(\d+) elemento/);
    const number = match ? match[1] : '0';

    return number ? Number(number) : null;
  }

  function obtenerNumFilas() {
    // return numFilasElement.length;

    const numFilasElements = document.querySelectorAll('#gvEnvio_ctl00 > tbody tr');
    const noRegistrosElement = document.querySelector('#gvEnvio_ctl00 > tbody tr td');

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
      activarFilas = false;
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
      '#gvEnvio_ctl00_ctl03_ctl01_PageSizeComboBox_Input'
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
      const tbody = document.querySelector('#gvEnvio_ctl00 > tbody');

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
