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
// Lógica para generar el contenido de cada celda en la nueva columna.
// Puedes acceder a otras celdas de la fila actual si es necesario.
// Ejemplo: Tomar el texto de la primera celda y añadirle un sufijo.
// const firstCell = rowElement.querySelector('td');
// if (firstCell) {
//   return `${firstCell.textContent.trim()}-SKU`;
// }

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
// const originalHiddenColumns1Based = [1, 3, 4, 5, 10];
// const adjustedHiddenColumns = originalHiddenColumns1Based.map((col) => {
// 	const zeroBasedCol = col - 1;
// 	return zeroBasedCol >= columnIndexToInsert ? zeroBasedCol + 1 : zeroBasedCol;
// });

/**
 * Ordena la tabla por una o varias columnas dadas.
 * @param {object} params - Parámetros de la función.
 * @param {HTMLTableElement} params.table - El elemento <table>.
 * @param {number[]} params.columns - Un array de números de columna (1-indexado) que especifican el orden de prioridad para el ordenamiento.
 *                                    Por ejemplo, [3, 1] ordenará primero por la columna 3, y luego por la columna 1 para las filas con valores iguales en la columna 3.
 * @param {'asc'|'desc'} [params.order='asc'] - El orden de clasificación ('asc' para ascendente, 'desc' para descendente). Se aplica a todas las columnas.
 */
export function OrderBYColumns({ table, columns, order = 'asc' }) {
	try {
		if (!table) {
			throw new Error('Error: Tabla no encontrada');
		}
		if (!columns || !Array.isArray(columns) || columns.length === 0) {
			throw new Error('Error: Se debe proporcionar un array de índices de columna (mayor que 0) para ordenar.');
		}
		for (const colIndex of columns) {
			if (typeof colIndex !== 'number' || colIndex <= 0) {
				throw new Error(`Error: Índice de columna inválido: ${colIndex}. Deben ser números mayores que 0.`);
			}
		}

		const rows = Array.from(table.querySelectorAll('tbody tr'));

		if (!rows.length) {
			console.warn('No hay filas para ordenar');
			return;
		}

		const incompleteRows = rows.filter((row) => row.classList.contains('mensaje-incompleto'));
		const sortableRows = rows.filter((row) => !row.classList.contains('mensaje-incompleto'));

		sortableRows.sort((rowA, rowB) => {
			for (const colIndex of columns) {
				const cellA = rowA.cells[colIndex - 1]?.textContent?.trim() ?? '';
				const cellB = rowB.cells[colIndex - 1]?.textContent?.trim() ?? '';

				// Intentamos convertir a número si ambos valores son numéricos
				const a = isNaN(cellA) ? cellA : parseFloat(cellA);
				const b = isNaN(cellB) ? cellB : parseFloat(cellB);

				let comparison = 0;
				if (a < b) comparison = -1;
				else if (a > b) comparison = 1;

				if (comparison !== 0) {
					return order === 'asc' ? comparison : -comparison;
				}
			}
			return 0; // Son iguales en todas las columnas especificadas
		});

		const tbody = table.querySelector('tbody');
		if (tbody) {
			tbody.innerHTML = ''; // Limpia el tbody
			sortableRows.forEach((row) => tbody.appendChild(row));
			incompleteRows.forEach((row) => tbody.appendChild(row));

			console.log('Tabla ordenada correctamente.');
		} else {
			console.warn('Elemento tbody no encontrado en la tabla.');
		}
	} catch (error) {
		console.error(`Error al ordenar la tabla: ${error.message || error}`);
	}
}
