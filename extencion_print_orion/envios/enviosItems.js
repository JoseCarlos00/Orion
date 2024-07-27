/** Envio item */
async function main() {
  try {
    await insertButtons();
    await insertWorkUnitContainer();

    const btnWorkUnit = document.querySelector('#workUnitButton');
    btnWorkUnit && btnWorkUnit.addEventListener('click', workUnitInsert);

    insertFooterDetail();
    window.addEventListener('beforeprint', reviseTextarea);
    window.addEventListener('afterprint', afterPrint);

    const textarea = document.getElementById('workUnit');

    if (!textarea) {
      console.error('Error: no existe el elemento textrea');
      return;
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    alertPrintEnvioItem();
  }

  function insertButtons() {
    // Boton imprimir
    const button = `
      <div class="p-2 bd-highlight">
          <button id="printButtonEnvio" class="btn btn-secondary btn-sm btn-dark-teal" type="button"><i class="fas fa-print"></i>Imprimir</button>
      </div>

      <div class="p-2 bd-highlight">
          <button id="workUnitButton" class="btn btn-secondary btn-sm btn-dark-teal" type="button"><i class="fas fa-file-word"></i>Work Unit</button>
      </div>
      `;

    return new Promise((resolve, reject) => {
      const elementoInsert = document.querySelector(
        '#UpdatePanel > main > div.d-flex.bd-highlight > div:nth-child(2)'
      );

      if (!elementoInsert) {
        console.error('Error: el elemento a insertar no existe');
        return resolve();
      }

      elementoInsert.insertAdjacentHTML('afterend', button);

      // Ajusta titulo de Envio #
      document.querySelector(
        '#UpdatePanel > main > div.d-flex.bd-highlight > div.flex-grow-1.bd-highlight'
      ).style = 'padding-right: calc(88.22px + 0.5rem*2 + 0.5rem + 110.18px);';

      resolve();
    });
  }

  function insertWorkUnitContainer() {
    const overviewCardWorkUnit = `
      <div class="overview-card">
        <button class="btn btn-link overview-card-toggle collapsed" type="button" data-toggle="collapse" data-target="#workUnit" aria-expanded="false" aria-controls="collapseExample">
          <i class="fas fa-file-pen icons" aria-hidden="true"></i>Work Unit
        </button>

        <div class="overview-card-content filtros collapse show" id="workUnit" style="">
          <div class="form-row">
            <div class="col-sm work-unit">
                <div class="form-group">
                  <label for="workUnit"> Work Unit: <button id="resetWorkUnit" class="btn btn-danger btn-sm " type="reset"><i class="fas fa-trash-can" aria-hidden="true"></i></button></label>
                  <textarea id="workUnitTextarea" class="animarTexto form-control collapse show" rows="1" placeholder="..." style=""></textarea>
              </div>
            </div>
          </div>
        </div>
    </div>
    `;

    return new Promise(resolve => {
      const elementToInsert = document.querySelector(
        '#UpdatePanel > main > div.main-overview.row > div:nth-child(2)'
      );

      if (!elementToInsert) {
        console.error('Error: no se encontro el elemento a insertar [WorkUnitContainer]');
        resolve();
        return;
      }

      elementToInsert.insertAdjacentHTML('beforeend', overviewCardWorkUnit);

      setTimeout(() => {
        const btnReset = document.querySelector('#resetWorkUnit');
        const textarea = document.querySelector('#workUnitTextarea');

        btnReset.addEventListener('click', () => textarea && (textarea.value = ''));

        // Save to sessionStorage when the page is about to be refreshed or navigated away from
        window.addEventListener('beforeunload', () => {
          sessionStorage.setItem('workUnit', textarea.value);
        });

        const savedValue = sessionStorage.getItem('workUnit');
        if (savedValue) {
          textarea.value = savedValue;
        }
      }, 50);

      resolve();
    });
  }

  async function insertFooterDetail() {
    const tbodyFooterDetail = document.querySelector(
      '#divImpresionRepCotizacion > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody'
    );

    if (!tbodyFooterDetail) {
      return console.error('No existe el tbody del footer');
    }

    tbodyFooterDetail.innerHTML = '';

    // Obtener los parámetros almacenados
    await getParamsURL();
    const params = getStoredParams();

    // Crear el contenido condicionalmente
    let envioContent = params.numberEnvio
      ? `<td style="text-wrap: nowrap;"><strong>Envio:</strong> ${params.numberEnvio}</td>`
      : '';
    let userContent = params.userEnvio
      ? `<td style="text-wrap: nowrap;"><strong>Creado:</strong> ${params.userEnvio}</td>`
      : '';
    let fechaContent = params.fechaEnvio
      ? `<tr><td style="text-wrap: nowrap;"><strong>Fecha:</strong> ${params.fechaEnvio}</td></tr>`
      : '';

    // Componer el HTML del footer con los contenidos condicionales
    const tbodyInner = `
      <tr>
        ${envioContent}
        ${userContent}
      </tr>
        ${fechaContent}
    `;

    tbodyFooterDetail.insertAdjacentHTML('afterbegin', tbodyInner);
  }

  function workUnitInsert() {
    const textarea = document.querySelector('#workUnitTextarea');

    if (!textarea) {
      console.error('Error: No existe el elemento textarea');
    }

    let workUnitText = prompt('Ingrese una unidad de trabajo:') ?? '';

    if (workUnitText) {
      textarea.value = workUnitText.trim();

      textarea.classList.remove('animarTexto');
      setTimeout(() => textarea.classList.add('animarTexto'), 50);
    }
  }

  function reviseTextarea() {
    const textarea = document.querySelector('#workUnitTextarea');
    const textareaContainer = document.querySelector('#workUnit');

    if (!textarea) {
      console.error('Error: No existe el elemento textarea');
    }

    if (!textareaContainer) {
      console.error('Error: No existe el Contenedor de textarea');
    }

    const txtValue = textarea.value.trim();

    if (!txtValue) {
      textareaContainer.classList.add('hidden');
    }

    textarea.value = txtValue;
  }

  function afterPrint() {
    const textareaContainer = document.querySelector('#workUnit');

    if (!textareaContainer) {
      console.error('Error: No existe el Contenedor de textarea');
    }

    textareaContainer.classList.remove('hidden');
  }
}

// END

/** Obtener Datos de la URL */
/** Obtiene y almacena en Session Storage los valores obtenidos
 */
function getParamsURL() {
  return new Promise(resolve => {
    const urlString = window.location.href; // Obtener la URL actual
    const url = new URL(urlString); // Crear un objeto URL
    const parametros = url.searchParams; // Obtener los parámetros de la URL

    const userEnvio = parametros.get('UserEnvio') ?? '';
    const fechaEnvio = parametros.get('FechaEnvio') ?? '';
    const numberEnvio = parametros.get('EnvioNum') ?? '';

    // Guardar en sessionStorage
    sessionStorage.setItem('UserEnvio', userEnvio);
    sessionStorage.setItem('FechaEnvio', fechaEnvio);
    sessionStorage.setItem('EnvioNum', numberEnvio);

    console.log(
      'Guardado en sessionStorage:\n',
      'UserEnvio:',
      userEnvio,
      '\nFechaEnvio',
      fechaEnvio,
      '\nEnvioNum',
      numberEnvio
    );
    resolve();
  });
}

function getStoredParams() {
  const userEnvio = sessionStorage.getItem('UserEnvio') || '';
  const fechaEnvio = sessionStorage.getItem('FechaEnvio') || '';
  const numberEnvio = sessionStorage.getItem('EnvioNum') || '';

  console.log(
    'Recuperado de sessionStorage:\n',
    'UserEnvio:',
    userEnvio,
    '\nFechaEnvio',
    fechaEnvio,
    '\nEnvioNum',
    numberEnvio
  );

  return { userEnvio, fechaEnvio, numberEnvio };
}

window.addEventListener('load', main, { once: true });
