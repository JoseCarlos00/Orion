console.log('Print.js');

function getColumnIndex(selector) {
  // Selecciona el header usando el selector proporcionado
  const header = document.querySelector(selector);
  if (!header) {
    console.error('No se encontró el header con el selector proporcionado.');
    return -1; // Devuelve -1 si no se encuentra el header
  }

  // Encuentra la fila de headers (la primera fila del thead)
  const table = header.closest('table');
  const headerRow = table.querySelector('thead tr');

  // Obtén todos los headers de la fila
  const headers = Array.from(headerRow.children);

  // Encuentra el índice del header proporcionado
  const index = headers.indexOf(header);

  if (index === -1) {
    console.error('El header no se encontró en la fila de headers.');
  }

  return index;
}

function inicio() {
  // Obtén el contenido de la URL
  const params = new URLSearchParams(window.location.search);
  const thead = params.get('thead');
  const tbody = params.get('tbody');

  console.log('thead:', thead);
  console.log('tbody:', tbody);

  if (!thead || !tbody) return;

  // Renderiza el contenido en el elemento 'content'
  const contentElement = document.getElementById('content');

  if (contentElement) {
    contentElement.innerHTML = thead + decodeURIComponent(tbody);

    mostrarTablas()
      .then(value => {
        console.log(value);

        eventoClickCheckBox()
          .then(msg => {
            console.log(msg);
            const showColumns = [0, 1];

            createFiltersCheckbox();
          })
          .catch(err => console.error('Error al crear el evento click mostrar:', err));
      })
      .catch(err => {
        console.error(err);
      });
  }
}

function mostrarTablas() {
  return new Promise((resolve, reject) => {
    //Mostrar tablas
    showElement('#ListPaneDataGrid_SHIPMENT_ID');
    showElement('#ListPaneDataGrid_PARENT_CONTAINER_ID');
    showElement('#ListPaneDataGrid_QUANTITY');
    showElement('#ListPaneDataGrid_ITEM');
    showElement('#ListPaneDataGrid_ITEM_DESC');

    resolve('Tablas insertadas');
  });
}

function showElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.style.display = 'table-cell';
  }
}

/** CheckBook */
// Función para mostrar u ocultar una columna específica por su índice
function toggleColumn() {
  const columnIndex = parseInt(this.value);
  const table = document.querySelector('#content');
  const rows = table.rows;

  if (this.checked) {
    // Mostrar columna
    for (let i = 0; i < rows.length; i++) {
      rows[i].cells[columnIndex].style.display = 'table-cell';
      rows[i].cells[columnIndex].classList.remove('hidden');

      if (i === 0) {
        const checkboxContainer = this.closest('.checkbox-container');
        checkboxContainer && checkboxContainer.classList.toggle('checkbox-checked');
      }
    }
  } else {
    // Ocultar columna
    for (let i = 0; i < rows.length; i++) {
      rows[i].cells[columnIndex].classList.add('hidden');

      if (i === 0) {
        const checkboxContainer = this.closest('.checkbox-container');
        checkboxContainer && checkboxContainer.classList.toggle('checkbox-checked');
      }
    }
  }
}

// Función para ocultar una columna específica por su índice
function hideColumn(columnIndex) {
  const table = document.querySelector('#content');
  const rows = table.rows;

  for (let i = 0; i < rows.length; i++) {
    rows[i].cells[columnIndex].style.display = 'none';
  }
}

/**
 * Crea input type="CheckBook" para cada columna de la tabla
 *
 * Al no pasar ningun parametro se muestran todas las columnas
 *
 * @param {type Array} columnsToShow : Indice de Columnas a ocultar
 * @param {type Bolean} showColumns : Valor por defaul = true
 */

function createCheckboxElements(columnsToShow, showColumns) {
  return new Promise((resolve, reject) => {
    const table = document.querySelector('#content');
    const headerRow = table.rows[0]; // Obtener la primera fila (encabezados)
    const numColumns = headerRow.cells.length;

    const checkboxContainer = document.getElementById('checkboxContainer');

    if (!checkboxContainer) {
      reject('No existe el elemento checkboxContainer');
      return; // Salir de la función si no se encontró el contenedor de checkboxes
    }

    // Generar los checkboxes
    for (let i = 0; i < numColumns; i++) {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      const span = document.createElement('span');

      checkbox.type = 'checkbox';
      checkbox.className = 'column-toggle';
      checkbox.value = i;

      span.className = 'checkmark';

      // Si la columna está en la lista de columnas a mostrar/ocultar y showColumns es true,
      // o si la columna no está en la lista y showColumns es false, mostrarla
      if (columnsToShow.length === 0 && showColumns === true) {
        label.className = 'checkbox-container';
        checkbox.checked = true;
      } else if (
        (columnsToShow.includes(i) && showColumns) ||
        (!columnsToShow.includes(i) && !showColumns)
      ) {
        checkbox.checked = true;
        label.className = 'checkbox-container';
      } else {
        checkbox.checked = false;
        label.className = 'checkbox-container checkbox-checked';
        hideColumn(i); // Oculta la columna automáticamente
      }

      label.appendChild(checkbox);
      label.appendChild(span);
      label.appendChild(document.createTextNode(headerRow.cells[i].textContent));
      checkboxContainer.appendChild(label);
    }

    resolve();
  });
}

function createFiltersCheckbox(columnsToShow = [], showColumns = true) {
  console.log('[Create Filters Checkbox]');

  const checkboxContainer = document.getElementById('checkboxContainer');
  checkboxContainer && (checkboxContainer.innerHTML = '');

  // Esperar a que los checkboxes estén creados antes de asignar eventos
  createCheckboxElements(columnsToShow, showColumns)
    .then(() => {
      // Eliminar eventos de cambio anteriores para evitar la duplicación
      const checkboxes = document.querySelectorAll('.column-toggle');
      checkboxes.forEach(checkbox => {
        checkbox.removeEventListener('change', toggleColumn);
      });

      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', toggleColumn);
      });

      const toggleButton = document.getElementById('toggleButton');

      if (toggleButton) {
        toggleButton.removeAttribute('disabled');
      }
    })
    .catch(err => {
      console.error('Error al crear los checkboxes:', err);
    });
}

function eventoClickCheckBox() {
  return new Promise((resolve, reject) => {
    const toggleButton = document.getElementById('toggleButton');

    // Obtener el elemento del path SVG
    const togglePath = document.querySelector('.toggleIcon path');

    if (!toggleButton) {
      return reject('No existe el elemento #toggleButton');
    }

    // Definir la función que se utilizará para manejar el evento 'click'
    const toggleButtonClickHandler = function () {
      const checkboxContainer = document.getElementById('checkboxContainer');
      if (!checkboxContainer) {
        return reject('No existe el elemento #checkboxContainer');
      }

      // Verificar si la clase 'mostrar' está presente en el checkboxContainer
      if (!checkboxContainer.classList.contains('mostrar')) {
        // Si no está presente, la agregamos
        checkboxContainer.classList.add('mostrar');
        // Cambiar el atributo "d" del path SVG para representar un símbolo de menos(-)
        togglePath.setAttribute('d', 'M5 12h14');
      } else {
        // Si está presente, la eliminamos
        checkboxContainer.classList.remove('mostrar');
        // Cambiar el atributo "d" del path SVG para representar un símbolo de más(+)
        togglePath.setAttribute('d', 'M12 19v-7m0 0V5m0 7H5m7 0h7');
      }
    };

    toggleButton.removeEventListener('click', toggleButtonClickHandler);

    // Agregar el evento 'click' al toggleButton
    toggleButton.addEventListener('click', toggleButtonClickHandler);

    // Resolver la promesa con un mensaje indicando que el evento se ha creado correctamente
    resolve('Evento click creado correctamente');
  });
}

// Espera a que la página haya cargado antes de ejecutar la función inicio
window.addEventListener('load', inicio, { once: true });
