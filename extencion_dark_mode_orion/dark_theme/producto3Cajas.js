const styleProducto3CajasElement = `<style id="styleProducto3Cajas"></style>`;

/* ("http://fmorion.dnsalias.com/orion/paginas/Bodega/Productos3Cajas") */
const styleProducto3Cajas = `
    .RadGrid_Bootstrap .rgSelectedRow > td,
    .RadGrid_Bootstrap .rgSelectedRow td.rgSorted {
        background: #181344 !important;
    }

    .RadGrid_Bootstrap .rgAltRow .rgSorted {
        background-color: #0d1117;
        ;
    }
}
`;

(() => {
  // Insertar estilos
  document.querySelector('body').insertAdjacentHTML('beforeend', styleProducto3CajasElement);
  const styleElement = document.querySelector('#styleProducto3Cajas');

  // Verificar el valor en localStorage después de toggle
  if (toggleState === 'true') {
    styleElement.innerHTML = styleProducto3Cajas;
  }
})();

function inicio() {
  /* Toogle Switch */
  const toggleButton = document.querySelector('.toggle-switch input');

  if (toggleButton) {
    const styleElement = document.querySelector('#styleProducto3Cajas');

    if (!styleElement) {
      document.querySelector('body').insertAdjacentHTML('beforeend', styleProducto3CajasElement);
      setTimeout(() => {
        const styleElement = document.querySelector('#styleProducto3Cajas');

        toggleButton.addEventListener('click', () => toggle(toggleButton, styleElement));
      }, 50);
    } else {
      toggleButton.addEventListener('click', () => toggle(toggleButton, styleElement));
    }

    if (toggleState === 'true') {
      toggleButton.checked = true;
    }
  }

  function toggle(toggleButton, styleElement) {
    if (!styleElement) return;

    if (toggleButton.checked === true) {
      localStorage.setItem('toggleState', 'true'); // Guardar en localStorage
      styleElement.innerHTML = styleProducto3Cajas;
    } else {
      localStorage.removeItem('toggleState'); // Eliminar del localStorage si no está marcado
      styleElement.innerHTML = '';
    }
  }
}

window.addEventListener('load', inicio, { once: true });
