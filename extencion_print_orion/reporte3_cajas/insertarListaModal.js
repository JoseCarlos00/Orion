async function insertarLIsta() {
  let datos = [];

  try {
    await insertarBotonLista();

    await insertarModal();

    modalFunction();
  } catch (error) {
    console.error('Error:', error);
    return;
  }

  function insertarBotonLista() {
    const buttonPrint = `
     <div class="p-2 bd-highlight">
        <button id="insertList" type="button" class="btn btn-sm btn-purple mt-3 position-relative">
          <i class="fas fa-plus" aria-hidden="true"></i> Insertar Lista
        </button>
    </div>
      `;

    return new Promise((resolve, reject) => {
      const elementToInsert = document.querySelector(
        '#frmReciboListas > main > div.row > div > div.d-flex.bd-highlight.mb-3 > div.mr-auto.p-2.bd-highlight'
      );

      if (elementToInsert) {
        elementToInsert.insertAdjacentHTML('beforebegin', buttonPrint);

        setTimeout(resolve, 50);
      } else {
        console.log(new Error('No se encontroe el elemento a insertar: Button Insert List'));
        reject();
      }
    });
  }

  function insertarModal() {
    const htmlModal = `
      <section class="modal-container-insert">
        <div id="myModalInserToItem" class="modal">
          <div class="modal-content">

            <button type="button" aria-label="Close" data-balloon-pos="left" class="close">
              <svg aria-hidden="true" focusable="false" data-prefix="fad" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="fa-circle-xmark">
                <path fill="currentColor"
                  d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
                  class="fa-secondary"></path>
                <path fill="currentColor"
                  d="M209 175c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47z"
                  class="fa-primary"></path>
              </svg>
            </button>

            <form id="FormInsertItem" action="" class="insertar-item">
              <label for="insertItems"> Insertar Items </label>
              <textarea id="insertItems" name="itemsRegisters" required placeholder="9413-6209-34996\n9238-8384-6456"></textarea>

                <button class="button" id="registrarItems" type="submit">
                  <span class="text">Registrar</span>
                </button>
            </form>

          </div>
        </div>
      </section>
    `;

    return new Promise((resolve, reject) => {
      const body = document.querySelector('body');

      if (!body) {
        console.error('Error: no se encontro el Body');
        reject();
        return;
      }

      body.insertAdjacentHTML('beforeend', htmlModal);
      setTimeout(resolve, 50);
    });
  }

  function modalFunction() {
    const modalInsert = document.getElementById('myModalInserToItem');
    const btnOpenModal = document.getElementById('insertList');
    const btnCloseModal = document.querySelector('.modal-container-insert .close');

    setEventListeners({ modalInsert, btnCloseModal, btnOpenModal });
  }

  function setEventModal(elements) {
    const { modalInsert, btnCloseModal, btnOpenModal } = elements;

    // Cuando el usuario hace clic en el botón, abre el modal
    btnOpenModal.addEventListener('click', function () {
      modalInsert.style.display = 'block';

      const textarea = document.querySelector('#insertItems');
      textarea && textarea.focus();
    });

    // Cuando el usuario hace clic en <span> (x), cierra el modal
    btnCloseModal.addEventListener('click', function () {
      modalInsert.style.display = 'none';
    });
  }

  function setEventListeners(elements) {
    const { modalInsert } = elements;
    setEventModal(elements);

    const formInsertItems = document.querySelector('#FormInsertItem');
    formInsertItems && formInsertItems.addEventListener('submit', registrarDatos);

    // Cuando el usuario hace clic fuera del modal, ciérralo
    window.addEventListener('click', function (e) {
      const element = e.target;

      if (element == modalInsert) {
        modalInsert.style.display = 'none';
      }
    });

    // Cuando el usuario apreta la tecla Esc, ciérralo
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (modalInsert.style.display === 'block') {
          modalInsert.style.display = 'none';
        }
      }
    });
  }

  function insertarItems() {
    console.log('[Insertar ITems]', datos);
    let itemsRegistrados = 0;

    if (datos.length === 0) {
      console.warn('Array de datos vacia');
      closeModal();
      return;
    }

    const tbody = document.querySelector('#gvPedidosTienda_ctl00 > tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    if (rows.length === 0) {
      console.warn('Filas de la tabla vacia');
      closeModal();
      return;
    }

    rows.forEach(row => {
      const inputCheckbox = row.querySelector('td[valign="middle"] input[type="checkbox"]');
      const inputItem = row.querySelector('td:nth-child(2)');
      const inputItemText = inputItem ? inputItem.textContent.trim() : '';

      if (datos.includes(inputItemText)) {
        inputCheckbox && inputCheckbox.click();
        itemsRegistrados++;
      }
    });

    // Filas insertadas
    badgleButtonList({ itemsRegistrados, total: datos.length });

    closeModal();

    // Cerrar modal
    function closeModal() {
      setTimeout(() => {
        const modal = document.getElementById('myModalInserToItem');
        modal && (modal.style.display = 'none');
      }, 150);
    }
  }

  function registrarDatos(e) {
    e.preventDefault();

    const formItem = e.target;
    const textarea = formItem.itemsRegisters;

    if (!formItem || !textarea)
      return console.error('Error: no se encontro el formulario insertItem');

    datos.length = 0;

    // Dividir el texto en lineas
    const lineas = textarea.value.trim().split('\n');

    // Procesar cada linea
    lineas.forEach(linea => {
      const regex = /^(\d+-\d+-\d+),?\s*$/;
      const match = linea.match(regex);

      if (match) {
        const valorSinComa = match[1];

        /**
         * Si el item a registrar y existe en el array
         * O si se inserta mas de una vez el mismo ITEM no lo agraga al array
         */
        if (!datos.includes(valorSinComa)) {
          datos.push(valorSinComa);
        }
      }
    });

    // Limpiar el campo de texto
    formItem.reset();

    // Insertar datos
    insertarItems();
  }

  function badgleButtonList({ itemsRegistrados, total }) {
    const button = document.getElementById('insertList');
    const badgleExist = document.getElementById('badgleItem');

    // Crear el badge
    const badge = document.createElement('span');
    badge.className =
      'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger';
    badge.id = 'badgleItem';
    badge.innerHTML = `${total}<span class="visually-hidden">unread messages</span>`;

    // Agregar el badge al botón
    if (badgleExist) {
      button.replaceChild(badge, badgleExist);
    } else {
      button.insertAdjacentElement('beforeend', badge);
    }

    // Actualizar el contenido del badge (ejemplo)
    setTimeout(() => {
      badge.innerHTML = `${itemsRegistrados}<span class="visually-hidden">unread messages</span>`;
    }, 2000);
  }
}

window.addEventListener('load', insertarLIsta, { once: true });
