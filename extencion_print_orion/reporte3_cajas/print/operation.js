export function insertarThead() {
  return new Promise((resolve, reject) => {
    const primeraFila = document.querySelector('table tbody tr:nth-child(1)');

    if (!primeraFila) {
      return reject('No se encontro la primera fila el [thead]');
    }

    // html thead
    const thead = `
  <thead>
    <tr>${primeraFila.innerHTML}</tr>
  </thead>
  `;

    const table = document.querySelector('#tablePreview > table');

    if (!table) {
      return reject('No se encontro la tabla con el id: #tablePreview table');
    }

    const caption = document.querySelector('#myCaption');

    if (caption) {
      caption.insertAdjacentHTML('afterend', thead);
    } else {
      table.insertAdjacentHTML('afterbegin', thead);
    }

    // Borrar el elemento primera fila
    primeraFila.remove();
    resolve();
  });
}
