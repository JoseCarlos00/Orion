import {
	eventoClickCheckBox,
	createFiltersCheckbox,
	eventoClickCheckBoxRow,
	createFiltersCheckboxRow,
} from "./checkBox.js";

import { FormGroupHidden } from "./FormGroupHidden.js";

import { urlSchema } from "./mock.js"
import { OrderBYColumns } from "./utils/table.js";
console.log("Print.js");


function cleanThead() {
	return new Promise((resolve) => {
		// Seleccionar el <thead> original y las filas <tr> dentro de él
		const originalThead = document.querySelector("#content > thead");
		const headers = originalThead.querySelectorAll("tr th");

		const rowOld = originalThead.querySelector("tr");

		if (!originalThead) {
			console.error("No se encontró el <thead> en la <table>");
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

function exportTable(table) {
	try {
		if (!table) {
			throw new Error('No se encontró la <table> para exportar');
		}

		// Obtén fecha actual
		const now = new Date();
		const day = String(now.getDate()).padStart(2, '0');
		const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
		const year = now.getFullYear();

		const fecha = `${day}-${month}-${year}`;
		const fileName = `reporte3Cajas_${fecha}.xlsx`;

		// Usa SheetJS para crear un libro y agregar una hoja con los datos de la tabla
		const workbook = XLSX.utils.table_to_book(table);

		XLSX.writeFile(workbook, fileName);
		console.log(`El archivo ${fileName} se ha descargado exitosamente.`);
	} catch (error) {
		console.error('Error:', error);
	}
}



class PrintReport3Cajas {
	constructor() {
		try {
			this.formGroupHiddenManager = new FormGroupHidden();
			this.filterFormCajas = document.getElementById('filterFormCajas');

			this.params = new URLSearchParams(window.location.search);
			// this.params = urlSchema;

			this.thead = this.params.get('thead') || null;
			this.tbody = this.params.get('tbody') || null;

			if (!this.thead || !this.tbody) {
				throw new Error('Error: No se encontró [thead] and [tbody] en los parametros de la URL');
			}

			// Renderiza el contenido en el elemento 'content'
			this.table = document.getElementById('content');
			this.theadElement = document.createElement('thead');
			this.tbodyElement = document.createElement('tbody');

			if (!this.table) {
				throw new Error('No se encontró la <table> a insertar');
			}

			this.theadElement.innerHTML = this.thead;
			this.tbodyElement.innerHTML = decodeURIComponent(this.tbody);

			this.table.insertAdjacentElement('beforeend', this.theadElement);
			this.table.insertAdjacentElement('beforeend', this.tbodyElement);

			this.setEventFilterForm();
		} catch (error) {
			console.error('Error al inicializar PrintReport3Cajas:', error);
		}
	}

	async render() {
		try {
			if (!this.table) {
				throw new Error('No se encontró la tabla para renderizar');
			}
			setEventDownload(this.table);

			await cleanThead();

			eventoClickCheckBox()
				.then((msg) => {
					console.log(msg);

					const hiddenColumns = [1, 3, 4, 5, 10].map((index) => index - 1);
					createFiltersCheckbox(hiddenColumns, false);
				})
				.catch((err) => console.error('Error al crear el evento click Columns:', err));

			eventoClickCheckBoxRow()
				.then((msg) => {
					console.log(msg);

					const hiddenGroup = Array.from(this.formGroupHiddenManager.hiddenGroupList);
					createFiltersCheckboxRow(hiddenGroup, false);
				})
				.catch((err) => console.error('Error al crear el evento click Rows:', err));

			OrderBYColumns({ table: this.table, columns: [9, 3], order: 'asc' });
			this.hiddenRows();

			this.formGroupHiddenManager.render();

			// setTimeout(() => window.print(), 500);
			setTimeout(() => {
				this.insertarPageBreak(9);
				window.print();
			}, 200);
		} catch (error) {
			console.error('Error al renderizar PrintReport3Cajas:', error);
		}
	}

	hiddenRows() {
		const rows = Array.from(this.table.querySelectorAll('tbody tr'));
		const position = 8;
		const hiddenGroup = this.formGroupHiddenManager.hiddenGroupList;

		if (!rows || rows.length === 0) {
			console.warn('No hay filas <tr>');
			return;
		}

		rows.forEach((tr) => {
			const grupoElement = tr.querySelector(`td:nth-child(${position})`);

			if (grupoElement) {
				const grupoText = grupoElement.textContent.trim();

				// Verificar si el texto de la celda está en el grupo de valores para ocultar
				if (hiddenGroup.has(grupoText)) {
					tr.classList.add('hidden');
				}
			}
		});
	}

	insertarPageBreak(positionElement) {
		try {
			console.log('Insertando PageBreak en la tabla...');
			
			if (!this.table) {
				throw new Error('No se encontró la tabla con el id: #tablePreview');
			}

			if (!positionElement) {
				throw new Error('No se encontró la posición del elemento');
			}

			// filtrar y agregar clase al primer TD de cada grupo
			const filas = this.table.querySelectorAll('tr:not(.hidden)');

			if (!filas && filas.length === 0) {
				console.warn('No hay filas <tr> en la tabla');
				return;
			}


			// Limpiar las clases de page-break antes de aplicar nuevas
			filas.forEach((fila) => {
				const td = fila.querySelector(`td:nth-child(${positionElement})`);
				if (td) {
					td.classList.remove('page-break');
				}
			});
			

			// Iterar sobre las filas
			filas.forEach((fila, index) => {
				// Ignorar la primera fila (encabezados)
				if (index === 0) return;

				const valorDeLaFilaActual = fila.querySelector(`td:nth-child(${positionElement})`)?.textContent;

				// Obtener el valor de la primera celda de la fila anterior
				const valorDeLaFilaAnterior = filas[index - 1].querySelector(`td:nth-child(${positionElement})`)?.textContent;

				if (!valorDeLaFilaActual || !valorDeLaFilaAnterior) {
					return;
				}

				// Verificar si el valor actual es diferente al valor anterior
				if (valorDeLaFilaActual !== valorDeLaFilaAnterior) {
					if (index > 1) {
						console.log({
							valorDeLaFilaActual,
							valorDeLaFilaAnterior,
							bool: valorDeLaFilaActual !== valorDeLaFilaAnterior,
							index,
						});
						console.log(
							`Agregando PageBreak en la fila: ${index - 1} con valor: ${valorDeLaFilaActual}`,
							filas[index - 1]
						);

						filas[index - 1].querySelector(`td:nth-child(${positionElement})`).classList.add('page-break');
					}
				}
			});

			

		} catch (error) {
			console.error('Error al insertar PageBreak:', error);
			
		}
	}

	setEventFilterForm() {
		if (!this.filterFormCajas) {
			console.error('No se encontró el formulario de filtro de cajas');
			return;
		}

		this.filterFormCajas.addEventListener('change', (event) => {
			event.preventDefault();
			const formData = new FormData(this.filterFormCajas);

			for (const [key, value] of formData.entries()) {
				if (value) {
					console.log(`Filtro aplicado: ${key} = ${value}`);
					
				}
			}

		});
	}
}

// Espera a que la página haya cargado antes de ejecutar la función inicio
// window.addEventListener("load", main, { once: true });
window.addEventListener("load", () => {
	const printReport3Cajas = new PrintReport3Cajas();
	printReport3Cajas.render()
		.then(() => console.log('PrintReport3Cajas renderizado exitosamente'))
		.catch((error) => console.error('Error al renderizar PrintReport3Cajas:', error));
}, { once: true });
