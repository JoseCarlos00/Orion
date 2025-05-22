/**
 * Inserta una nueva columna en una tabla HTML en la posición especificada.
 * @param {HTMLTableElement} table - El elemento <table>.
 * @param {number} columnIndex - El índice (basado en 0) donde se insertará la nueva columna.
 *                               Si quieres insertar en la "posición 6", el índice será 5.
 * @param {string} headerText - El texto para el encabezado de la nueva columna (<th>).
 * @param {function(HTMLTableRowElement, number): string} cellContentGenerator -
 *        Una función que genera el contenido para cada celda (<td>) en la nueva columna.
 *        Recibe el elemento de la fila (tr) y el índice de la fila (rowIndex) como argumentos.
 *        Debe devolver el string que se usará como textContent de la celda.
 */
export function insertColumn(table, columnIndex, headerText, cellContentGenerator) {
	if (!table) {
		console.error('Elemento <table> no proporcionado para la inserción de columna.');
		return;
	}

	// Insertar celda de encabezado en el thead
	const headerRow = table.querySelector('thead tr');
	if (headerRow) {
		const newTh = document.createElement('th');
		newTh.textContent = headerText;
		// headerRow.children son los <th> existentes
		const referenceTh = headerRow.children[columnIndex];
		headerRow.insertBefore(newTh, referenceTh || null); // Si referenceTh es undefined (ej. columnIndex es igual al número de columnas), insertBefore lo añade al final.
	} else {
		console.warn('Fila de encabezado (thead tr) no encontrada para la inserción de columna.');
	}

	// Insertar celdas de datos en cada fila del tbody
	const bodyRows = table.querySelectorAll('tbody tr');
	bodyRows.forEach((row, rowIndex) => {
		const newTd = document.createElement('td');
		newTd.textContent = cellContentGenerator(row, rowIndex);
		// row.children son los <td> existentes en esta fila
		const referenceTd = row.children[columnIndex];
		row.insertBefore(newTd, referenceTd || null);
	});
}

// --- INSERCIÓN DE NUEVA COLUMNA ---
// Ejemplo: Insertar una columna en la 6ª posición (índice 5)
// const columnIndexToInsert = 7; // 0-indexado para la 6ª posición
// insertColumn(
// 	table,
// 	columnIndexToInsert,
// 	'Code', // Texto del encabezado para la nueva columna
// 	(rowElement, rowIndex) => {
// 		// Lógica para generar el contenido de cada celda en la nueva columna.
// 		// Puedes acceder a otras celdas de la fila actual si es necesario.
// 		// Ejemplo: Tomar el texto de la primera celda y añadirle un sufijo.
// 		// const firstCell = rowElement.querySelector('td');
// 		// if (firstCell) {
// 		//   return `${firstCell.textContent.trim()}-SKU`;
// 		// }

// 		return rowElement.children[2]; // Contenido de ejemplo
// 	}
// --- FIN DE INSERCIÓN DE NUEVA COLUMNA ---

// IMPORTANTE: Ajustar los índices de las columnas utilizadas posteriormente.
// Si insertaste una columna en columnIndexToInsert, cualquier índice de columna
// mayor o igual a columnIndexToInsert en el código subsiguiente deberá incrementarse en 1.

// Ejemplo de ajuste para hiddenColumns:
// Original: const hiddenColumns = [1, 3, 4, 5, 10].map((index) => index - 1); // Da [0, 2, 3, 4, 9]
// Si columnIndexToInsert = 5:
// [0, 2, 3, 4] < 5, se mantienen.
// [9] >= 5, se convierte en 9 + 1 = 10.
// Nuevos índices ocultos: [0, 2, 3, 4, 10]
const originalHiddenColumns1Based = [1, 3, 4, 5, 10];
const adjustedHiddenColumns = originalHiddenColumns1Based.map((col) => {
	const zeroBasedCol = col - 1;
	return zeroBasedCol >= columnIndexToInsert ? zeroBasedCol + 1 : zeroBasedCol;
});
