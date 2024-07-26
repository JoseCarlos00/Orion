const styleReporteTableauElement = `<style id="styleReporteTableau"></style>`;

/* ("http://fmorion.dnsalias.com/orion/paginas/Reportes/ReporteTableau2.aspx") */
const styleReporteTableau = `
    #divreportesh {
        margin-top: 24px;
    }

    .thumbnail {
        color: rgb(230, 237, 243);
        background-color: rgba(177, 186, 196, 0.12);
        border: none;
        box-shadow: rgb(67 67 67 / 25%) 0px 13px 27px -5px,
        rgb(167 18 18 / 30%) 0px 8px 16px -8px;

        input[type="image"] {
            filter: grayscale(1);
        }
    }

    .caption h4 {
        color: rgb(230, 237, 243) !important;
    }
}
`;

(() => {
  // Insertar estilos
  document.querySelector('body').insertAdjacentHTML('beforeend', styleReporteTableauElement);
  const styleElement = document.querySelector('#styleReporteTableau');

  // Verificar el valor en localStorage después de toggle
  if (toggleState === 'true') {
    styleElement.innerHTML = styleReporteTableau;
  }
})();

function inicio() {
  /* Toogle Switch */
  const toggleButton = document.querySelector('.toggle-switch input');

  if (toggleButton) {
    const styleElement = document.querySelector('#styleReporteTableau');

    if (!styleElement) {
      document.querySelector('body').insertAdjacentHTML('beforeend', styleReporteTableauElement);
      setTimeout(() => {
        const styleElement = document.querySelector('#styleReporteTableau');

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
      styleElement.innerHTML = styleReporteTableau;
    } else {
      localStorage.removeItem('toggleState'); // Eliminar del localStorage si no está marcado
      styleElement.innerHTML = '';
    }
  }
}

window.addEventListener('load', inicio, { once: true });
