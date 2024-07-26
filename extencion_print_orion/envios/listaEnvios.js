/** Lista de Envios */
function main() {
  try {
    document.addEventListener('click', eventClick);

    async function eventClick(e) {
      const element = e.target;

      if (
        element.nodeName === 'SPAN' &&
        /^gvEnvioListas_ctl00_ctl\d+_txtEnvioID$/.test(element.id)
      ) {
        const anchor = element.closest('a');
        const trElement = element.closest('tr');

        console.log('anchor:', anchor);

        if (!anchor) {
          console.error('Elemento <a> no encontrado');
          return;
        }

        if (!trElement) {
          console.error('Elemento <tr> no encontrado');
          return;
        }

        // Redirigir al enlace deseado
        await transformAnchor({ trElement, anchor });
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }

  function transformAnchor({ trElement, anchor }) {
    return new Promise(resolve => {
      // Verifica si los índices de los hijos existen antes de acceder a ellos
      const cells = trElement.children;
      const GENERADO_POR = cells[9] ? cells[9].textContent.trim() : 'No disponible';
      const FECHA_ENVIO = cells[5] ? cells[5].textContent.trim() : 'No disponible';

      // Actualiza el href del anchor si no existe ya el parámetro
      const url = new URL(anchor.href);
      url.searchParams.set('UserEnvio', GENERADO_POR);
      url.searchParams.set('FechaEnvio', FECHA_ENVIO);
      anchor.href = url.toString();

      resolve();
    });
  }
}

window.addEventListener('load', main, { once: true });
