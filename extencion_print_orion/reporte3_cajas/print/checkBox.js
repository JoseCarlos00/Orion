/** CheckBook */
// Función para mostrar u ocultar una columna específica por su índice
function toggleColumn() {
  const columnIndex = parseInt(this.value) + 1;
  const table = document.querySelector('#content');

  const checkboxContainer = this.closest('.checkbox-container');

  if (!table) {
    console.error('No existe el elemento <table>');
    return;
  }

  const rows = Array.from(
    table.querySelectorAll(`tr :is(th:nth-child(${columnIndex}), td:nth-child(${columnIndex}))`)
  );

  if (rows.length === 0) {
    console.warn('No hay filas <tr>');
    return;
  }

  rows.forEach(td => {
    if (this.checked) {
      td.style.display = 'table-cell';
    }

    td.classList.toggle('hidden', !this.checked);
    checkboxContainer.classList.toggle('checkbox-checked', !this.checked);
  });
}

function toggleRow() {
  const table = document.querySelector('#content');
  const rows = Array.from(table.rows);
  const value = this.value;
  const columnIndex = 8;
  const checkboxContainer = this.closest('.checkbox-container');

  if (!table || !rows) {
    console.error('No existe el elemento <table>');
    return;
  }

  if (rows.length === 0) {
    console.warn('No hay filas <tr>');
    return;
  }

  rows.forEach(tr => {
    const grupoElement = tr.querySelector(`td:nth-child(${columnIndex})`);

    if (grupoElement && checkboxContainer) {
      const grupoText = grupoElement.textContent.trim();

      if (grupoText === value) {
        tr.classList.toggle('hidden', !this.checked);
        checkboxContainer.classList.toggle('checkbox-checked', !this.checked);
      }
    }
  });
}

// Función para ocultar una columna específica por su índice
function hideColumn(columnIndex) {
  const table = document.querySelector('#content');
  if (!table) {
    console.error('No existe el elemento <table>');
    return;
  }

  const rows = table.rows;

  // Verifica si columnIndex es un número válido y está dentro del rango
  if (
    typeof columnIndex !== 'number' ||
    !Number.isInteger(columnIndex) ||
    columnIndex < 0 ||
    (rows.length > 0 && columnIndex >= rows[0].cells.length)
  ) {
    console.error(`Índice de columna inválido [${columnIndex}]`);
    return;
  }

  for (let i = 0; i < rows.length; i++) {
    const cell = rows[i].cells[columnIndex];
    if (cell) {
      cell.classList.add('hidden');
    }
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

function createCheckboxElements(columnsToShow = [], showColumns = true) {
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

/**
 * Mostrar o uculatar columnas dependiendo del valor del indicio proporcionado
 * @param {Array} columnsToShow Indice de columnas a ocultar/mostar
 * @param {Bolean} showColumns Si es TRUE los indices solo mostraran esas columnas si es FALSE se ocultaran
 */
export function createFiltersCheckbox(columnsToShow = [], showColumns = true) {
  console.log('[Create Filters Checkbox]');

  const checkboxContainer = document.getElementById('checkboxContainer');
  checkboxContainer && (checkboxContainer.innerHTML = '');

  // Esperar a que los checkboxes estén creados antes de asignar eventos
  createCheckboxElements(columnsToShow, showColumns)
    .then(() => {
      // Eliminar eventos de cambio anteriores para evitar la duplicación
      const checkboxes = document.querySelectorAll('#checkboxContainer .column-toggle');
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

export function eventoClickCheckBox() {
  return new Promise((resolve, reject) => {
    const toggleButton = document.getElementById('toggleButton');

    // Obtener el elemento del path SVG
    const togglePath = document.querySelector('#toggleButton .toggleIcon path');

    if (!toggleButton) {
      return reject('No existe el elemento #toggleButton');
    }

    if (!togglePath) {
      return reject('No existe el elemento .toggleIcon path');
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
    resolve('Evento click colunm creado correctamente');
  });
}

export function eventoClickCheckBoxRow() {
  return new Promise((resolve, reject) => {
    const toggleButton = document.getElementById('toggleButtonRow');

    // Obtener el elemento del path SVG
    const togglePath = document.querySelector('#toggleButtonRow .toggleIcon path');

    if (!toggleButton) {
      return reject('No existe el elemento #toggleButtonRow');
    }

    if (!togglePath) {
      return reject('No existe el elemento #toggleButtonRow .toggleIcon path');
    }

    // Definir la función que se utilizará para manejar el evento 'click'
    const toggleButtonClickHandler = function () {
      const checkboxContainer = document.getElementById('checkboxContainerGroup');
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
    resolve('Evento click row creado correctamente');
  });
}

/** Filter Group */
async function createCheckboxElementsGroup(columnsDefaul = [], show = true) {
  return new Promise((resolve, reject) => {
    const table = document.getElementById('content');
    const rowsGroup = Array.from(table.querySelectorAll('tbody tr td:nth-child(8)'));

    if (!rowsGroup || !table) {
      reject('No se encontraron los elementos <table> and <tbody>');
      return;
    }

    if (rowsGroup.length === 0) {
      reject('No hay filas en el <tbody>');
      return;
    }

    const checkboxContainer = document.getElementById('checkboxContainerGroup');

    if (!checkboxContainer) {
      reject('No existe el elemento checkboxContainer');
      return; // Salir de la función si no se encontró el contenedor de checkboxes
    }

    const valuesGroup = rowsGroup.map(td => td.textContent.trim());
    const uniqueGroup = [...new Set(valuesGroup)];

    // Generar los checkboxes

    uniqueGroup.forEach(groupName => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      const span = document.createElement('span');

      checkbox.type = 'checkbox';
      checkbox.className = 'column-toggle';
      checkbox.value = groupName;

      span.className = 'checkmark';

      if (columnsDefaul.length === 0 && show === true) {
        label.className = 'checkbox-container';
        checkbox.checked = true;
      } else if (
        (columnsDefaul.includes(groupName) && show) ||
        (!columnsDefaul.includes(groupName) && show === false)
      ) {
        checkbox.checked = true;
        label.className = 'checkbox-container';
      } else {
        checkbox.checked = false;
        label.className = 'checkbox-container checkbox-checked';
      }

      label.appendChild(checkbox);
      label.appendChild(span);
      label.appendChild(document.createTextNode(groupName));
      checkboxContainer.appendChild(label);
    });

    resolve();
  });
}

export function createFiltersCheckboxRow(columnsToShow = [], showColumns = true) {
  console.log('[Create Filters Checkbox Row]');

  const checkboxContainer = document.getElementById('checkboxContainerGroup');
  checkboxContainer && (checkboxContainer.innerHTML = '');

  // Esperar a que los checkboxes estén creados antes de asignar eventos
  createCheckboxElementsGroup(columnsToShow, showColumns)
    .then(() => {
      // Eliminar eventos de cambio anteriores para evitar la duplicación
      const checkboxes = document.querySelectorAll('#checkboxContainerGroup .column-toggle');
      checkboxes.forEach(checkbox => {
        checkbox.removeEventListener('change', toggleRow);
      });

      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', toggleRow);
      });

      const toggleButton = document.getElementById('toggleButtonRow');

      if (toggleButton) {
        toggleButton.removeAttribute('disabled');
      }
    })
    .catch(err => {
      console.error('Error al crear los checkboxes:', err);
    });
}
