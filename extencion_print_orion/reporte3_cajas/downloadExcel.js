function setEventDownload() {
  const btnDownload = document.getElementById('btnExcel2');

  if (!btnDownload) {
    console.error('No se encontro el boton para descargar');
    return;
  }

  btnDownload.addEventListener('click', async () => {
    const table = document.querySelector('#gvPedidosTienda_ctl00');

    const continuar = await verificarLineas();

    if (continuar) {
      console.warn('Se ha detenido la ejecucion');
      return;
    }

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

    // Clonar el encabezado de la tabla si es visible, excluyendo la primera y última columna
    const headerRows = table.querySelectorAll('thead > tr');
    headerRows.forEach(row => {
      const newRow = document.createElement('tr');
      const headers = row.querySelectorAll('th');
      headers.forEach((th, index) => {
        if (th.style.display !== 'none' && index !== 0 && index !== headers.length - 1) {
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

    // Clonar las filas visibles, excluyendo la primera y última columna
    const tbodyPrincicpal = table.querySelector('& > tbody');
    const rows = tbodyPrincicpal.querySelectorAll('tr');

    rows.forEach(row => {
      const newRow = document.createElement('tr');
      const cells = row.querySelectorAll('td');
      cells.forEach((td, index) => {
        if (td.style.display !== 'none' && index !== 0 && index !== cells.length - 1) {
          const newTd = document.createElement('td');
          newTd.textContent = td.textContent;
          newRow.appendChild(newTd);
        }
      });
      if (newRow.children.length > 0) {
        tbody.appendChild(newRow);
      }
    });

    visibleTable.appendChild(tbody);

    resolve(visibleTable);
  });
}

function exportTable(table) {
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
