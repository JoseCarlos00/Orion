export function sortValueString(rows, table, columnIndex) {
  return new Promise((resolve, reject) => {
    try {
      // Ordena las filas en función del índice de columna
      rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].innerText;
        const cellB = b.cells[columnIndex].innerText;

        return cellA.localeCompare(cellB);
      });

      // Limpia el tbody y vuelve a agregar las filas ordenadas
      const tbody = table.querySelector('tbody');
      tbody.innerHTML = ''; // Limpia el contenido actual
      rows.forEach(row => tbody.appendChild(row)); // Agrega las filas ordenadas

      resolve('Tabla ordenada exitosamente');
    } catch (error) {
      reject(error);
    }
  });
}
