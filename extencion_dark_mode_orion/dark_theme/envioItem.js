const styleEnvioItemElement = `<style id="styleEnvioItem"></style>`;
/* "http://fmorion.dnsalias.com/orion/paginas/Envios/Envio.aspx?EnvioNum=" */
const styleEnvioItemCSS = `
    .container-work-unit {
        textarea {
            background-color: transparent;
            color: #e6edf3;
        }
    }

    @media print {
        .container-work-unit {
            textarea {

                color: #000;
            }
        }
    }
`;

(() => {
  // Insertar estilos
  document.querySelector('body').insertAdjacentHTML('beforeend', styleEnvioItemElement);
  const styleElement = document.querySelector('#styleEnvioItem');

  // Verificar el valor en localStorage después de toggle
  if (toggleState === 'true') {
    styleElement.innerHTML = styleEnvioItemCSS;
  }
})();

function inicio() {
  /* Toogle Switch */
  const toggleButton = document.querySelector('.toggle-switch input');

  if (toggleButton) {
    const styleElement = document.querySelector('#styleEnvioItem');

    if (!styleElement) {
      document.querySelector('body').insertAdjacentHTML('beforeend', styleEnvioItemElement);
      setTimeout(() => {
        const styleElement = document.querySelector('#styleEnvioItem');

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
      styleElement.innerHTML = styleEnvioItemCSS;
    } else {
      localStorage.removeItem('toggleState'); // Eliminar del localStorage si no está marcado
      styleElement.innerHTML = '';
    }
  }
}

window.addEventListener('load', inicio, { once: true });
