class EnvioItemManager {
  constructor() {
    this.init();

    this.textarea = null;

    this.userEnvio = null;
    this.numberEnvio = null;
    this.fechaEnvio = null;
    this.workUnit = null;
  }

  async init() {
    try {
      await this.insertButtons();
      await this.insertWorkUnitContainer();

      const btnWorkUnit = document.querySelector('#workUnitButton');
      if (btnWorkUnit) {
        btnWorkUnit.addEventListener('click', this.workUnitInsert.bind(this));
      }

      await this.initializeVariable();
      await this.insertFooterDetail();
      this.setEventListener();

      if (!this.textarea) {
        console.error('Error: no existe el elemento textarea');
        return;
      }

      this.insertWorkUnitOfUrlParams();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      alertPrintEnvioItem();
    }
  }

  async initializeVariable() {
    this.textarea = document.getElementById('workUnitTextarea');
    await this.getParamsURL();
  }

  async insertButtons() {
    const buttonHTML = `
      <div class="p-2 bd-highlight">
          <button id="printButtonEnvio" class="btn btn-secondary btn-sm btn-dark-teal" type="button"><i class="fas fa-print"></i>Imprimir</button>
      </div>

      <div class="p-2 bd-highlight">
          <button id="workUnitButton" class="btn btn-secondary btn-sm btn-dark-teal" type="button"><i class="fas fa-file-word"></i>Work Unit</button>
      </div>
    `;

    return new Promise(resolve => {
      const elementoInsert = document.querySelector(
        '#UpdatePanel > main > div.d-flex.bd-highlight > div:nth-child(2)'
      );

      if (!elementoInsert) {
        console.error('Error: el elemento a insertar no existe');
        return resolve();
      }

      elementoInsert.insertAdjacentHTML('afterend', buttonHTML);

      // Ajusta titulo de Envio #
      document.querySelector(
        '#UpdatePanel > main > div.d-flex.bd-highlight > div.flex-grow-1.bd-highlight'
      ).style = 'padding-right: calc(88.22px + 0.5rem*2 + 0.5rem + 110.18px);';

      resolve();
    });
  }

  insertWorkUnitOfUrlParams() {
    const { textarea, workUnit } = this;

    if (!textarea) {
      console.error('Error: el textarea no existe');
    }

    textarea.value = workUnit;
  }

  async insertWorkUnitContainer() {
    const overviewCardWorkUnit = `
      <div class="overview-card">
        <button class="btn btn-link overview-card-toggle collapsed" type="button" data-toggle="collapse" data-target="#workUnit" aria-expanded="false" aria-controls="collapseExample">
          <i class="fas fa-file-pen icons" aria-hidden="true"></i>Work Unit
        </button>

        <div class="overview-card-content filtros collapse show" id="workUnit" style="">
          <div class="form-row">
            <div class="col-sm work-unit-container">
                <div class="form-group">
                  <label for="workUnitTextarea"> Work Unit: <button id="resetWorkUnit" class="btn btn-danger btn-sm " type="reset"><i class="fas fa-trash-can" aria-hidden="true"></i></button></label>
                  <textarea id="workUnitTextarea" class="animarTexto form-control collapse show" rows="1" placeholder="..." style=""></textarea>
              </div>
            </div>
          </div>
        </div>
    </div>
    `;

    return new Promise((resolve, reject) => {
      const elementToInsert = document.querySelector(
        '#UpdatePanel > main > div.main-overview.row > div:nth-child(2)'
      );

      if (!elementToInsert) {
        reject('[insertWorkUnitContainer]: no se encontró el elemento a insertar ');
        return;
      }

      elementToInsert.insertAdjacentHTML('beforeend', overviewCardWorkUnit);
      setTimeout(resolve, 50);
    });
  }

  setEventListener() {
    window.addEventListener('beforeprint', this.reviseTextarea.bind(this));
    window.addEventListener('afterprint', this.afterPrint.bind(this));

    const { textarea } = this;

    const btnReset = document.querySelector('#resetWorkUnit');
    btnReset.addEventListener('click', () => {
      if (!textarea) {
        return;
      }

      textarea.value = '';
      this.updateURLParameter('WorkUnit', '');
    });

    textarea.addEventListener('input', () => {
      const { value } = textarea;
      this.updateURLParameter('WorkUnit', value.trim());
    });
  }

  async insertFooterDetail() {
    const tbodyFooterDetail = document.querySelector(
      '#divImpresionRepCotizacion > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody'
    );

    if (!tbodyFooterDetail) {
      return console.error('No existe el tbody del footer');
    }

    tbodyFooterDetail.innerHTML = '';

    const { userEnvio, numberEnvio, fechaEnvio } = this;

    // Crear el contenido condicionalmente
    let envioContent = numberEnvio
      ? `<td style="text-wrap: nowrap;"><strong>Envio:</strong> ${numberEnvio}</td>`
      : '';
    let userContent = userEnvio
      ? `<td style="text-wrap: nowrap;"><strong>Creado:</strong> ${userEnvio}</td>`
      : '';
    let fechaContent = fechaEnvio
      ? `<tr><td style="text-wrap: nowrap;"><strong>Fecha:</strong> ${fechaEnvio}</td></tr>`
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

  workUnitInsert() {
    const { textarea } = this;

    if (!textarea) {
      console.error('Error: No existe el elemento textarea');
      return;
    }

    let workUnitText = prompt('Ingrese una unidad de trabajo:') ?? '';

    if (workUnitText) {
      textarea.value = workUnitText.trim();

      // Actualizar la URL con el parámetro `WorkUnit`
      this.updateURLParameter('WorkUnit', workUnitText.trim());
    }
  }

  reviseTextarea() {
    const { textarea } = this;
    const textareaContainer = document.querySelector('#workUnit');

    if (!textarea) {
      console.error('Error: No existe el elemento textarea');
      return;
    }

    if (!textareaContainer) {
      console.error('Error: No existe el Contenedor de textarea');
      return;
    }

    const txtValue = textarea.value.trim();

    if (!txtValue) {
      textareaContainer.classList.add('hidden');
    }

    textarea.value = txtValue;
  }

  afterPrint() {
    const textareaContainer = document.querySelector('#workUnit');

    if (!textareaContainer) {
      console.error('Error: No existe el Contenedor de textarea');
      return;
    }

    textareaContainer.classList.remove('hidden');
  }

  // Método para actualizar la URL
  updateURLParameter(key, value) {
    const url = new URL(window.location.href); // Obtener la URL actual

    url.searchParams.set(key, value); // Actualizar el parámetro en la URL

    window.history.pushState({}, '', url); // Actualizar la URL sin recargar la página
  }

  getParamsURL() {
    return new Promise((resolve, reject) => {
      try {
        const urlString = window.location.href; // Obtener la URL actual
        const url = new URL(urlString); // Crear un objeto URL
        const parametros = url.searchParams; // Obtener los parámetros de la URL

        // Recuperar y asignar los parámetros con valores por defecto si están vacíos
        const {
          UserEnvio = '',
          FechaEnvio = '',
          EnvioNum = '',
          WorkUnit = '',
        } = Object.fromEntries(parametros.entries());

        // Asignar a las propiedades del objeto
        this.userEnvio = UserEnvio;
        this.fechaEnvio = FechaEnvio;
        this.numberEnvio = EnvioNum;
        this.workUnit = WorkUnit;

        console.log(
          'numberEnvio:',
          this.numberEnvio,
          ' | userEnvio:',
          this.userEnvio,
          ' | fechaEnvio:',
          this.fechaEnvio,
          ' | workUnit:',
          this.workUnit
        );

        resolve(); // Resolver la promesa
      } catch (error) {
        console.error('Error al obtener los parámetros de la URL:', error);
        reject(error); // Rechazar la promesa si ocurre algún error
      }
    });
  }
}

// Instanciar la clase al cargar la página
window.addEventListener('load', () => new EnvioItemManager(), { once: true });
