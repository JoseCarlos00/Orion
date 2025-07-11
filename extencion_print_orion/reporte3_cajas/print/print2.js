import {
  eventoClickCheckBox,
  createFiltersCheckbox,
  eventoClickCheckBoxRow,
  createFiltersCheckboxRow,
} from "./checkBox.js";

import { FormGroupHidden } from "./FormGroupHidden.js";
// const formGroupHiddenManager = new FormGroupHidden();

import { urlSchema } from "./mock.js"
import { OrderBYColumns } from "./utils/table.js";
console.log("Print.js");

async function main() {
  try {
    // Obtén el contenido de la URL
    // const params = new URLSearchParams(window.location.search);
    const params = urlSchema;
    const thead = params.get('thead');
    const tbody = params.get('tbody');
    

    if (!thead || !tbody) {
      console.error("Error: No se encontró [thead] and [tbody] en los parametros de la URL");
      return;
    }

    // Renderiza el contenido en el elemento 'content'
    const table = document.getElementById("content");
    const theadElement = document.createElement("thead");
    const tbodyElement = document.createElement("tbody");

    if (!table) {
      console.error("No se encontró la <table> a insertar");
      return;
    }

    theadElement.innerHTML = thead;
    tbodyElement.innerHTML = decodeURIComponent(tbody);

    table.insertAdjacentElement("beforeend", theadElement);
    table.insertAdjacentElement("beforeend", tbodyElement);

    setEventDownload();

    await cleanThead();

    eventoClickCheckBox()
      .then((msg) => {
        console.log(msg);

        const hiddenColumns = [1, 3, 4, 5, 10].map((index) => index - 1);
        createFiltersCheckbox(hiddenColumns, false);
      })
      .catch((err) => console.error("Error al crear el evento click mostrar:", err));

    eventoClickCheckBoxRow()
      .then((msg) => {
        console.log(msg);

        const hiddenGroup = Array.from(formGroupHiddenManager.hiddenGroupList);
        createFiltersCheckboxRow(hiddenGroup, false);
      })
      .catch((err) => console.error("Error al crear el evento click mostrar:", err));

    // await sortValueNumeric();
    OrderBYColumns({table, columns: [3, 8], order: "asc"})
    hiddenRows();

    formGroupHiddenManager.render();

    // setTimeout(() => window.print(), 500);
  } catch (error) {
    console.error("Error:", error);
  }
}

function cleanThead() {
  return new Promise((resolve) => {
    // Seleccionar el <thead> original y las filas <tr> dentro de él
    const originalThead = document.querySelector("#content > thead");
    const headers = originalThead.querySelectorAll("tr th");

    const rowOld = originalThead.querySelector("tr");

    if (!originalThead) {
      console.error("No se encontro el <thead> en la <table>");
      return;
    }

    if (headers.length === 0) {
      console.warn("No hay filas en el <tr>");
      resolve();
      return;
    }

    // Crear un nuevo elemento <tr>
    const rowNew = document.createElement("tr");

    headers.forEach((th) => {
      const thNew = document.createElement("th");
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
  return new Promise((resolve) => {
    try {
      const table = document.getElementById("content");
      if (!table) {
        resolve("Error: Tabla no encontrada");
        return;
      }

      const rows = Array.from(table.querySelectorAll("tbody tr"));
      const headerPositionElement = 9;

      if (!rows.length) {
        resolve("No hay filas para ordenar");
        return;
      }

      // Separa las filas con la clase 'mensaje-incompleto'
      const incompleteRows = rows.filter((row) => row.classList.contains("mensaje-incompleto"));
      const sortableRows = rows.filter((row) => !row.classList.contains("mensaje-incompleto"));

      sortableRows.sort((a, b) => {
        // Verificar la existencia de las celdas antes de acceder a sus valores
        const aCell = a.querySelector(`td:nth-child(${headerPositionElement})`);
        const bCell = b.querySelector(`td:nth-child(${headerPositionElement})`);

        if (!aCell || !bCell) {
          console.error("Una o ambas celdas no existen en las filas");
          return 0; // Si alguna celda no existe, no cambiar el orden
        }

        let aValue = aCell.innerText.trim();
        let bValue = bCell.innerText.trim();

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

      // Reinsertar las filas ordenadas y luego las filas incompletas al final del tbody
      const tbody = table.querySelector("tbody");
      tbody.innerHTML = ""; // Limpia el tbody
      sortableRows.forEach((row) => tbody.appendChild(row));
      incompleteRows.forEach((row) => tbody.appendChild(row));

      resolve("Tabla ordenada correctamente por valor numérico");
    } catch (error) {
      console.error(`Error al ordenar la tabla: ${error}`);
      resolve("Error al ordenar la tabla");
    }
  });
}

function hiddenRows() {
  const table = document.getElementById("content");
  const rows = Array.from(table.querySelectorAll("tbody tr"));
  const position = 8;
  const hiddenGroup = formGroupHiddenManager.hiddenGroupList;

  if (!rows || !table) {
    console.error("No se encontraron los elementos <table> and <tbody>");
    return;
  }

  if (rows.length === 0) {
    console.warn("No hay filas <tr>");
    return;
  }

  rows.forEach((tr) => {
    const grupoElement = tr.querySelector(`td:nth-child(${position})`);

    if (grupoElement) {
      const grupoText = grupoElement.textContent.trim();

      // Verificar si el texto de la celda está en el grupo de valores para ocultar
      if (hiddenGroup.has(grupoText)) {
        tr.classList.add("hidden");
      }
    }
  });
}

/**
 * Establece el evento de descarga para la tabla.
 * Al hacer clic en el botón de descarga, se obtiene una tabla con los datos visibles
 * y se exporta a un archivo Excel.
 * @param {HTMLTableElement} table 
 */
function setEventDownload(table) {
  const btnDownload = document.getElementById("btnExcel");

  if (!btnDownload) {
    console.error("No se encontró el botón para descargar");
    return;
  }

  btnDownload.addEventListener("click", async () => {
    const visibleTable = await getVisibleTableData(table);

    exportTable(visibleTable);
  });
}

function getVisibleTableData(table) {
  return new Promise((resolve, reject) => {
    if (!table) {
      console.error("No se encontro el elemento <table>");
      reject();
      return;
    }

    const visibleTable = document.createElement("table");
    const tbody = document.createElement("tbody");
    const thead = document.createElement("thead");

    // Clonar el encabezado de la tabla si es visible
    const headerRows = table.querySelectorAll("thead tr");

    headerRows.forEach((row) => {
      const newRow = document.createElement("tr");
      row.querySelectorAll("th").forEach((th, index) => {
        if (!th.classList.contains("hidden")) {
          const newTh = document.createElement("th");
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
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      if (!row.classList.contains("hidden")) {
        const newRow = document.createElement("tr");

        row.querySelectorAll("td").forEach((td, index) => {
          if (!td.classList.contains("hidden")) {
            const newTd = document.createElement("td");
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
      throw new Error("No se encontró la <table> para exportar");
    }

    // Usa SheetJS para crear un libro y agregar una hoja con los datos de la tabla
    const workbook = XLSX.utils.table_to_book(table);

    XLSX.writeFile(workbook, "reporte3Cajas.xlsx");
    console.log("El archivo se ha descargado exitosamente.");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Espera a que la página haya cargado antes de ejecutar la función inicio
// window.addEventListener("load", main, { once: true });
