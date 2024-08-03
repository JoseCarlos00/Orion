/** Banderas Globales */
let activarFilas = false;
let isVerificarLineasDeImpresionExecuted = false;

async function alertPrintTrabajosActivos() {
  try {
    setEventsListener();

    /** Inserar Enlace */
    const body = document.querySelector('body');
    const enlace =
      '<a href="#gvTrabajoActivoV3_ctl00_ctl03_ctl01_PageSizeComboBox_Input" id="irALista" hidden>Ir a Lista</a>';

    body && body.insertAdjacentHTML('afterbegin', enlace);
  } catch (error) {
    console.error('Error:', error);
  }
}

function setEventsListener() {
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
    '#gvTrabajoActivoV3_ctl00 > tfoot > tr > td > table > tbody > tr > td > div.rgWrap.rgInfoPart';
  const totalElement = document.querySelector(selector);

  // Obtener el contenido del elemento
  const text = totalElement ? totalElement.textContent.trim() : '';
  const match = text.match(/^(\d+) items in/);
  const number = match ? match[1] : '0';

  return number ? Number(number) : null;
}

function obtenerNumFilas() {
  // return numFilasElement.length;

  const totalRows = document.querySelectorAll('#gvTrabajoActivoV3_ctl00 > tbody tr');
  const firstRow = document.querySelector('#gvTrabajoActivoV3_ctl00 > tbody tr td');

  const firstRowText = firstRow ? firstRow.textContent.trim() : '';
  const totalNumberRows = totalRows.length;

  // Si el texto en noRegistrosElement contiene "No contiene Registros", entonces retornamos 0
  if (firstRowText.toLowerCase().includes('no contiene registros')) {
    return 0;
  }

  return Number(totalNumberRows);
}

function esImpresionCompleta(numFilas, totalNumber) {
  if (numFilas === totalNumber || (numFilas === 0 && totalNumber === 0)) {
    console.warn('El total de filas  === 0 y total === 0\n\t\t\tOR\n numfilas === totalNumber');
    return true;
  }
  return false;
}

function manejarImpresionIncompleta(numFilas, totalNumber) {
  if (numFilas > totalNumber) return;

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
    '#gvTrabajoActivoV3_ctl00_ctl03_ctl01_PageSizeComboBox_Input'
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
  return new Promise(resolve => {
    const tbody = document.querySelector('#gvTrabajoActivoV3_ctl00 > tbody');

    if (!tbody) {
      console.error('Error: no se encontro el elemento [tbody]');
      resolve();
      return;
    }

    const incompletePrintTr = document.querySelector('#incompletePrint');

    if (!incompletePrintTr) {
      const numColspan = document.querySelectorAll(
        '#gvTrabajoActivoV3_ctl00 > tbody > tr:first-child > td'
      );

      const htmlTrPrint = `
      <tr id="incompletePrint" class="mensaje-incompleto">
        <td colspan="${numColspan.length}"><h4 style="text-align: center;">Impresion Incompleta</h4></td>
      </tr>
    `;

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

async function verificarLineas() {
  console.log('[verificarLineas] se ha ejecutado');

  const totalNumber = obtenerTotalNumber();
  const numFilas = obtenerNumFilas();

  if (numFilas === null || totalNumber === null) {
    console.warn('Error al obtener el número de filas o el total.');
    alert('Ha ocurrido un error inesperado code:001');
    return false;
  }

  if (esImpresionCompleta(numFilas, totalNumber)) {
    alert('Ha ocurrido un error inesperado code: 002');
    return false;
  }

  // Maneja filas incompletas y espera a que se resuelva la promesa
  const result = await manejarFilasIncompletas(numFilas, totalNumber);
  return result;
}

async function manejarFilasIncompletas(numFilas, totalNumber) {
  return new Promise(async resolve => {
    if (numFilas <= totalNumber) {
      const userResponse = confirm(
        '❌ No están activadas todas las líneas\n' +
          '¿Desea continuar?\n' +
          '     ⚠️                                                                      Sí        /        No'
      );

      if (userResponse) {
        await insertarMessageIncompletePrint(); // Espera a que se resuelva la promesa
        resolve(false); // El usuario decide continuar
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
