const styleDashBoardElement = `<style id="styleDefaulDashBoard"></style>`;

/*
("http://fmorion.dnsalias.com/orion/Default.aspx")
("http://fmorion.dnsalias.com/Bodega/Default.aspx")
("http://fmorion.dnsalias.com/orion/paginas/Dashboard/Dashboard.aspx") 
*/
const styleDefaulDashBoard = `
    .form-wrapper {
        background-color: transparent;
        color: rgb(230, 237, 243) !important;
    }

    .form-wrapper .form-control {
        box-shadow: 0 0 8px 0 #5460a4c2;
        background-color: transparent !important;
        color: #000 !important;
    }

    .form-wrapper input::placeholder {
        color: #000 !important;
    }

    #WucHeader_myInput::placeholder {
        color: #e6edf3 !important;
    }
    
    #WucHeader_myInput:hover { border: none;}


    input:-webkit-autofill,
    input:-webkit-autofill:focus {
        background-color: red !important;
    }

    .form-group .fas {
        color: #000 !important;
    }

    #ctl00 {
        .btn,
        span .fas {
            background-color: transparent !important;
            color: rgb(230, 237, 243) !important;
        }

        button.btn {
            background-color: #000000b5 !important;
        }
    }
    .grid-container .container-fluid {
        display: none !important;
    }
    .main-cards {
        display: none !important;

        .card {
            background-color: rgba(177, 186, 196, 0.12) !important;
        }
    }
    .bg-craft-header {
        background: none !important;
    }
}
`;

(() => {
  // Insertar estilos
  document.querySelector('body').insertAdjacentHTML('beforeend', styleDashBoardElement);
  const styleElement = document.querySelector('#styleDefaulDashBoard');

  // Verificar el valor en localStorage después de toggle
  if (toggleState === 'true') {
    styleElement.innerHTML = styleDefaulDashBoard;
  }
})();

function inicio() {
  /* Toogle Switch */
  const toggleButton = document.querySelector('.toggle-switch input');

  if (toggleButton) {
    const styleElement = document.querySelector('#styleDefaulDashBoard');

    if (!styleElement) {
      document.querySelector('body').insertAdjacentHTML('beforeend', styleDashBoardElement);
      setTimeout(() => {
        const styleElement = document.querySelector('#styleDefaulDashBoard');

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
      styleElement.innerHTML = styleDefaulDashBoard;
    } else {
      localStorage.removeItem('toggleState'); // Eliminar del localStorage si no está marcado
      styleElement.innerHTML = '';
    }
  }
}

window.addEventListener('load', inicio, { once: true });
