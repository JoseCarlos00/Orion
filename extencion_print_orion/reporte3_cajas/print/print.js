import {
  eventoClickCheckBox,
  createFiltersCheckbox,
  eventoClickCheckBoxRow,
  createFiltersCheckboxRow,
} from './checkBox.js';

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

    setEventDownload();

    await cleanThead();

    eventoClickCheckBox()
      .then(msg => {
        console.log(msg);

        const hiddenColumns = [1, 3, 4, 5, 10].map(index => index - 1);
        createFiltersCheckbox(hiddenColumns, false);
      })
      .catch(err => console.error('Error al crear el evento click mostrar:', err));

    eventoClickCheckBoxRow()
      .then(msg => {
        console.log(msg);

        const hiddenGroup = ['YY PROMO/BZ1', 'ZMUEBLE TDAS'];
        createFiltersCheckboxRow(hiddenGroup, false);
      })
      .catch(err => console.error('Error al crear el evento click mostrar:', err));

    await sortValueNumeric();
    hiddenRows();

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

function sortValueNumeric() {
  return new Promise(resolve => {
    try {
      const table = document.getElementById('content');
      const rows = Array.from(table.querySelectorAll('tbody tr'));
      const headerPositionElement = 9;

      if (!rows || !table) {
        resolve('Error al ordenar tabla');
        return;
      }

      rows.sort((a, b) => {
        // Utilizar el valor de la URL en el selector
        let aValue = a.querySelector(`td:nth-child(${headerPositionElement})`).innerText;
        let bValue = b.querySelector(`td:nth-child(${headerPositionElement})`).innerText;

        // Verificar si los valores son numéricos
        const aValueNumeric = !isNaN(parseFloat(aValue)) && isFinite(aValue);
        const bValueNumeric = !isNaN(parseFloat(bValue)) && isFinite(bValue);

        // Comparar los valores numéricos
        if (aValueNumeric && bValueNumeric) {
          return parseFloat(aValue) - parseFloat(bValue);
        } else {
          // Si al menos uno de los valores no es numérico, comparar como cadenas
          return aValue.localeCompare(bValue);
        }
      });

      // Reinsertar las filas ordenadas en la tabla
      rows.forEach(row => {
        table.querySelector('tbody').appendChild(row);
      });
      resolve('Ordenar tabla por valor numerico correcto');
    } catch (error) {
      console.error(`Error al ordenar la tabla: ${error}`);
      resolve();
    }
  });
}

function hiddenRows() {
  const table = document.getElementById('content');
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const position = 8;
  const hiddenGroup = ['YY PROMO/BZ1', 'ZMUEBLE TDAS'];

  if (!rows || !table) {
    console.error('No se encontraron los elementos <table> and <tbody>');
    return;
  }

  if (rows.length === 0) {
    console.warn('No hay filas <tr>');
    return;
  }

  rows.forEach(tr => {
    const grupoElement = tr.querySelector(`td:nth-child(${position})`);

    if (grupoElement) {
      const grupoText = grupoElement.textContent.trim();

      // Verificar si el texto de la celda está en el grupo de valores para ocultar
      if (hiddenGroup.includes(grupoText)) {
        tr.classList.add('hidden');
      }
    }
  });
}

function setEventDownload() {
  const btnDownload = document.getElementById('btnExcel');

  if (!btnDownload) {
    console.error('No se encontro el boton para descargar');
    return;
  }

  btnDownload.addEventListener('click', async () => {
    const table = document.querySelector('#content');
    const visibleTable = await getVisibleTableData(table);

    exportTable(visibleTable);
  });
}

function getVisibleTableData(table) {
  return new Promise((resolve, reject) => {
    if (!table) {
      console.error('No se encontro el elemento <table>');
      reject();
      return;
    }

    const visibleTable = document.createElement('table');
    const tbody = document.createElement('tbody');
    const thead = document.createElement('thead');

    // Clonar el encabezado de la tabla si es visible
    const headerRows = table.querySelectorAll('thead tr');

    headerRows.forEach(row => {
      const newRow = document.createElement('tr');
      row.querySelectorAll('th').forEach((th, index) => {
        if (!th.classList.contains('hidden')) {
          const newTh = document.createElement('th');
          newTh.textContent = th.textContent;
          newRow.appendChild(newTh);
        }
      });
      if (newRow.children.length > 0) {
        thead.appendChild(newRow);
      }
    });

    // Agregar el encabezado al nuevo tbody
    visibleTable.appendChild(thead);

    // Clonar las filas visibles
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
      if (!row.classList.contains('hidden')) {
        const newRow = document.createElement('tr');

        row.querySelectorAll('td').forEach((td, index) => {
          if (!td.classList.contains('hidden')) {
            const newTd = document.createElement('td');
            newTd.textContent = td.textContent;
            newRow.appendChild(newTd);
          }
        });
        if (newRow.children.length > 0) {
          tbody.appendChild(newRow);
        }
      }
    });

    visibleTable.appendChild(tbody);
    resolve(visibleTable);
  });
}

async function exportTable(table) {
  try {
    if (!table) {
      throw new Error('No se encontro la <table> para exportar');
    }

    // Usa SheetJS para crear un libro y agregar una hoja con los datos de la tabla
    const workbook = XLSX.utils.table_to_book(table);

    XLSX.writeFile(workbook, 'reporte3Cajas.xlsx');
    console.log('El archivo se ha descargado exitosamente.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Espera a que la página haya cargado antes de ejecutar la función inicio
window.addEventListener('load', main, { once: true });
