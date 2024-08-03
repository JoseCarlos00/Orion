export function sortValueString(rows, table, columnIndex) {
  console.log('[sortValueString]');
  console.log('columnIndex:', columnIndex);

  // Verifica que el columnIndex sea válido
  if (rows.length === 0 || columnIndex < 0 || columnIndex >= rows[0].cells.length) {
    console.error('Índice de columna no válido o sin filas.');
    return;
  }

  // Separa las filas con la clase 'mensaje-incompleto'
  const incompleteRows = rows.filter(row => row.classList.contains('mensaje-incompleto'));
  const sortableRows = rows.filter(row => !row.classList.contains('mensaje-incompleto'));

  // Ordena las filas basándose en el valor de la columna
  sortableRows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex] ? rowA.cells[columnIndex].innerText.trim() : '';
    const cellB = rowB.cells[columnIndex] ? rowB.cells[columnIndex].innerText.trim() : '';

    // Comparar los valores como cadenas de texto
    return cellA.localeCompare(cellB, undefined, { numeric: true });
  });

  // Vuelve a añadir las filas ordenadas y luego las filas incompletas al tbody
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = ''; // Limpia el tbody
  sortableRows.forEach(row => tbody.appendChild(row));
  incompleteRows.forEach(row => tbody.appendChild(row));
}
