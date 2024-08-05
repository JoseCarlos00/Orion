import { eventoClickCheckBox, createFiltersCheckbox } from './checkBox.js';
import { sortValueString } from './funcionesGlobales.js';

console.log('Print.js');

async function main() {
  try {
    // Obtén el contenido de la URL
    const params = new URLSearchParams(window.location.search);
    const thead = params.get('thead');
    const tbody = params.get('tbody');

    if (!thead || !tbody) {
      console.error('Error: No se encontro [thead] and [tbody] en los parametros');
      return;
    }

    // Renderiza el contenido en el elemento 'content'
    const table = document.getElementById('content');
    const theadElement = document.createElement('thead');
    const tbodyElement = document.createElement('tbody');

    if (!table) {
      console.error('No se encontro la <table> a insertar');
      return;
    }

    theadElement.innerHTML = thead;
    tbodyElement.innerHTML = decodeURIComponent(tbody);

    table.insertAdjacentElement('beforeend', theadElement);
    table.insertAdjacentElement('beforeend', tbodyElement);

    await cleanThead();
    setEventOrdenar();

    eventoClickCheckBox()
      .then(msg => {
        console.log(msg);

        const hiddenColumns = [7, 10, 11, 12].map(index => index - 1);

        createFiltersCheckbox(hiddenColumns, false);
      })
      .catch(err => console.error('Error al crear el evento click mostrar:', err));

    setTimeout(() => window.print(), 500);
  } catch (error) {
    console.error('Error:', error);
  }
}

function cleanThead() {
  return new Promise(resolve => {
    // Seleccionar el <thead> original y las filas <tr> dentro de él
    const originalThead = document.querySelector('#content > thead');
    const headers = originalThead.querySelectorAll('tr th');

    const rowOld = originalThead.querySelector('tr');

    if (!originalThead) {
      console.error('No se encontro el <thead> en la <table>');
      return;
    }

    if (headers.length === 0) {
      console.warn('No hay filas en el <tr>');
      resolve();
      return;
    }

    // Crear un nuevo elemento <tr>
    const rowNew = document.createElement('tr');

    headers.forEach(th => {
      const thNew = document.createElement('th');
      const thText = th.textContent.trim();

      thNew.textContent = thText;

      rowNew.appendChild(thNew);
    });

    // Reemplazar el <tr> antiguo con el nuevo
    originalThead.replaceChild(rowNew, rowOld);
    resolve();
  });
}

function setEventOrdenar() {
  const radios = document.querySelectorAll('input[name="ordernar"]');

  if (!radios) {
    console.error(`No se encontraron los input [type="radio]`);
    return;
  }

  radios.forEach(radio => {
    radio.addEventListener('change', handleRadioChange);
  });
}

function getColumnIndexByHeaderText(table, headerText) {
  const headerCells = table.querySelectorAll('thead th');

  for (let i = 0; i < headerCells.length; i++) {
    if (headerCells[i].innerText.trim() === headerText) {
      return i; // Devuelve el índice de la columna si el texto coincide
    }
  }
  return -1; // Devuelve -1 si no se encuentra el texto
}

async function handleRadioChange(event) {
  try {
    const selectedValue = event.target.value;
    console.log('selectedValue:', selectedValue);

    if (selectedValue === 'No Ordenar') {
      return;
    }

    const table = document.querySelector('#content');
    const columnIndex = getColumnIndexByHeaderText(table, selectedValue);

    if (columnIndex === -1) {
      alert('Ha ocurrido un error inesperado');
      throw new Error('Columna no encontrada para el valor seleccionado');
    }

    const rows = Array.from(table.querySelectorAll('tbody tr'));

    // Ordena la tabla usando el índice de columna
    await sortValueString(rows, table, columnIndex);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Espera a que la página haya cargado antes de ejecutar la función inicio
window.addEventListener('load', main, { once: true });
