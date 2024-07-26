/** Inventario Bodega Filtros */
console.log('Inventario Bodega Filtros');

async function inventarioBodegaFitros() {
  try {
    await insertarInputCheckBox();

    await insertarEventosInputCheck();

    await insertCounterElements();
    hideInventory();
  } catch (error) {
    console.error('Error:', error);
  }

  function insertarInputCheckBox() {
    const htmlInputCheck = `
      <div class="d-flex custom-control custom-checkbox align-items-end pl-5">
          <input name="chkSinMtyGdl" type="checkbox" id="showMtyGdlTij" class="custom-control-input">
          <label class="custom-control-label" for="showMtyGdlTij">Mostrar Mty, Gdl y Tij</label>
      </div>
    `;

    return new Promise(resolve => {
      const elementToInsert = document.querySelector(
        '#frmConsultaMiodani > main > div.row > div > div > div.card-table > div.form-inline'
      );

      if (!elementToInsert) {
        console.error('No existe el elemento a insertar');
        resolve();
        return;
      }

      elementToInsert.insertAdjacentHTML('beforeend', htmlInputCheck);
      setTimeout(resolve, 50);
    });
  }

  function insertarEventosInputCheck() {
    return new Promise(resolve => {
      const checkbox = document.querySelector('#showMtyGdlTij');
      const table = document.querySelector('#gvInventario_ctl00');

      if (!checkbox) {
        console.error('Error: no existe el elemento checkbox');
        resolve();
        return;
      }

      if (!table) {
        console.error('Error: no existe el elemento table');
        resolve();
        return;
      }

      table.classList.add('table-no-show-rows');
      const showAll = true;

      checkbox.addEventListener('change', event => {
        if (checkbox.checked) {
          table.classList.add('show-rows');
          table.classList.remove('table-no-show-rows');
          updateRowCount(showAll);
        } else {
          table.classList.remove('show-rows');
          table.classList.add('table-no-show-rows');
          updateRowCount();
        }
      });

      resolve();
    });
  }

  function hideInventory() {
    try {
      const filas = document.querySelectorAll('#gvInventario_ctl00 > tbody tr');
      const primeraFila = document.querySelector('#gvInventario_ctl00 > tbody > tr > td');

      if (filas.length === 0) {
        console.error('No se encontraron filas en la tabla');
        return;
      }

      const primeraFilaText = primeraFila ? primeraFila.textContent.trim() : '';

      if (primeraFilaText.includes('No contiene Registros')) {
        console.warn('La tabla no contiene registros');
        return;
      }

      const regex = /^\/(Mty|Gdl|Tij)/;

      filas.forEach(tr => {
        const colorColumnElement = tr.querySelector('td:nth-child(9)');

        if (colorColumnElement) {
          const str = colorColumnElement.textContent.trim();

          if (regex.test(str)) {
            tr.classList.add('hidden-row');
          }
        }
      });

      // Actualizar el contador después de ocultar filas
      updateRowCount();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function updateRowCount(showAll) {
    const visibleRows = document.querySelectorAll(
      '#gvInventario_ctl00 > tbody tr:not(.hidden-row)'
    );
    const hiddenRows = document.querySelectorAll('#gvInventario_ctl00 > tbody tr.hidden-row');

    const visibleCountElement = document.getElementById('totalShow');
    const hiddenCountElement = document.getElementById('totalHidden');

    const visibleTotal = showAll ? '' : visibleRows.length;
    const hiddenTotal = showAll ? '' : hiddenRows.length;

    if (visibleCountElement) {
      visibleCountElement.textContent = isEmptyTable() ? '' : visibleTotal;
    }

    if (hiddenCountElement) {
      hiddenCountElement.textContent = isEmptyTable() ? '' : hiddenTotal;
    }

    function isEmptyTable() {
      const firstRow = document.querySelector('#gvInventario_ctl00 > tbody tr td');
      const firstRowText = firstRow ? firstRow.textContent.trim() : '';
      return firstRowText.includes('No contiene Registros');
    }
  }

  function insertCounterElements() {
    const htmlContadores = `
      <div class="form-group contadores-show-hidden">
        <label class="col-form-label col-form-label-sm">Mostradas:</label>
        <span id="totalShow"></span>
        </div>
        
        <div class="form-group contadores-show-hidden">
        <label class="col-form-label col-form-label-sm">Ocultas:</label>
        <span id="totalHidden"></span>
      </div>
    `;
    return new Promise((resolve, reject) => {
      const elementToInsert = document.querySelector(
        '#gvInventario_ctl00 > tfoot > tr > td > div > div'
      );

      if (!elementToInsert) {
        console.error('Error: no existe el elemento a insertar contadores');
        resolve();
        return;
      }

      elementToInsert.insertAdjacentHTML('beforeend', htmlContadores);
      elementToInsert.className = 'col-12';
      resolve();
    });
  }
}
