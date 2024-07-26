const styleTrabajoActivoElement = `<style id="styleTrabajoActivo"></style>`;

/*
"http://fmorion.dnsalias.com/orion/paginas/Bodega/TrabajosActivos.aspx",
"http://fmorion.dnsalias.com/Bodega/Bodega",
"https://tableau.fantasiasmiguel.com.mx/trusted/ijShoAskRoeVKTlcCIxTGA==:Umbs4BtTpnexPcQY4OKAytXz/views/TareasAbiertasTiendasMariano/TareasAbiertasTiendas"
*/
const styleTrabajosActivoCSS = `
.RadMenu_Bootstrap .rmGroup .rmLink:hover {
        color: rgb(230, 237, 243);
        background-color: rgba(177, 186, 196, 0.12);
    }
    .RadMenu_Bootstrap .rmGroup .rmSelected,
    .RadMenu_Bootstrap .rmGroup .rmSelected:hover,
    .RadMenu_Bootstrap .rmGroup .rmExpanded,
    .RadMenu_Bootstrap .rmGroup .rmExpanded:hover {
        color: rgb(230, 237, 243);
        background-color: rgb(22, 27, 33);
    }

    #Panel3 {
        scrollbar-width: thin;
        scrollbar-color: #585858 #444;

        .table-responsive {
            display: flex;
            justify-content: center;
        }

        .ReporteTableau {
            width: 80%;
            height: 1000px;
            filter: grayscale(.5) brightness(.9);
            margin-bottom: 20px;
        }
    }
}
`;

(() => {
  // Insertar estilos
  document.querySelector('body').insertAdjacentHTML('beforeend', styleTrabajoActivoElement);
  const styleElement = document.querySelector('#styleTrabajoActivo');

  // Verificar el valor en localStorage después de toggle
  if (toggleState === 'true') {
    styleElement.innerHTML = styleTrabajosActivoCSS;
  }
})();

function inicio() {
  /* Toogle Switch */
  const toggleButton = document.querySelector('.toggle-switch input');

  if (toggleButton) {
    const styleElement = document.querySelector('#styleTrabajoActivo');

    if (!styleElement) {
      document.querySelector('body').insertAdjacentHTML('beforeend', styleTrabajoActivoElement);
      setTimeout(() => {
        const styleElement = document.querySelector('#styleTrabajoActivo');

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
      styleElement.innerHTML = styleTrabajosActivoCSS;
    } else {
      localStorage.removeItem('toggleState'); // Eliminar del localStorage si no está marcado
      styleElement.innerHTML = '';
    }
  }
}

window.addEventListener('load', inicio, { once: true });
