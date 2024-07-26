/* Elementos Globales */
const toggleState = localStorage.getItem('toggleState');

const toggleSwitchElement = `
<div class="toggle-switch">
  <label class="switch">
    <input type="checkbox">
    <span class="slider"></span>
  </label>
</div>
`;

const preLoaderWhiteElement = `
<div id="preloader">
  <div class="container">
    <label>Cargando...</label>
    <div class="loading"></div>
  </div>
</div>
`;
const preLoaderBlackElement = `
<div id="preloader" style="background-color: #000; color: #fff;">
  <div class="container">
    <label>Cargando...</label>
    <div class="loading"></div>
  </div>
</div>
`;

/* http://fmorion.dnsalias.com/ */
const styleGobalCSS = `
body {
  background-color: #0d1117 !important;
  color: #e6edf3 !important;
}

.header ::placeholder {
  color: #848d97 !important;
}

/* Tablas */
.table {
  color: #e6edf3 !important;
  background-color: transparent !important;
}

.table-hover tbody tr:hover {
  color: #e6edf3 !important;
  opacity: 0.5 !important;
}

.table-theme-purple th {
  background-color: #000 !important;
  color: #e6edf3 !important;
}

.table-theme-purple th,
.table-theme-purple td {
  border-color: #7575a3 !important;
}

.table-theme-purple thead th {
  border-color: #7575a3 !important;
}

.table-theme-purple tbody tr:nth-of-type(odd) {
  background-color: #000 !important;
  color: #e6edf3 !important;
}

.table-theme-blue th {
  background-color: #000 !important;
  color: #e6edf3 !important;
}

.table-theme-blue th,
.table-theme-blue td {
  border-color: #7575a3 !important;
}

.table-theme-blue thead th {
  border-color: #7575a3 !important;
}

.table-theme-blue tbody tr:nth-of-type(odd) {
  background-color: #000 !important;
  color: #e6edf3 !important;
}

/* Header */
.bg-grey,
.bg-purple {
  background-color: #6f6f6f00 !important;
  color: #e6edf3 !important;
}

.custom-select,
.form-control {
  color: #ffffffa3 !important;
  background-color: #000 !important;
}

input::placeholder {
  color: #ffffffa3 !important;
}

.form-control:hover::placeholder,
.custom-select:hover {
  color: #2f81f7 !important;
}

.fas {
  color: #848d97 !important;
}

.btn:hover .fas,
.btn:hover {
  color: #2f81f7 !important;
}

.btn-link:hover,
.btn-link:hover .fas {
  color: #2f81f7 !important;
}

.overview-card {
  border-left: none !important;
  background-color: transparent !important;
}

.table-toolbar {
  background-color: transparent !important;
}

.overview-card-toggle {
  color: #999 !important;
}

.btn,
.header,
.footer {
  background-color: #000 !important;
  color: #848d97 !important;
}

.RadGrid_Bootstrap .rgAltRow > td {
  background-color: #0d1117 !important;;
}

.RadGrid_Bootstrap .rgMasterTable .rgSelectedCell,
.RadGrid_Bootstrap .rgSelectedRow > td,
.RadGrid_Bootstrap td.rgEditRow .rgSelectedRow,
.RadGrid_Bootstrap .rgSelectedRow td.rgSorted {
  background-color: #337ab7 !important;
}

.RadGrid_Bootstrap {
  border: none !important;
  background-color: #ffffff6e !important;
}

.RadGrid_Bootstrap .rgHoveredRow > td {
  background-color: #0d1117 !important;
}

.RadGrid_Bootstrap .rgPagerCell {
  border-top: 1px solid #ccc;
  background-color: transparent !important;
  color: #e6edf3 !important;
}

.RadGrid_Bootstrap .rgPagerCell .rgArrPart1,
.RadGrid_Bootstrap .rgPagerCell .rgArrPart2 {
  filter: invert(1) !important;
}

.RadComboBoxDropDown_Bootstrap .rcbHovered {
  color: #e6edf3 !important;
  background-color: #000 !important;
  opacity: 0.8 !important;
}

.RadGrid_Bootstrap .rgHeader,
.RadGrid_Bootstrap .rgHeader a {
  color: #e6edf3 !important;
}
.RadComboBoxDropDown .rcbList > li {
  background-color: #000 !important;
  color: #e6edf3 !important;
  opacity: 0.5 !important;
}

.RadComboBoxDropDown_Bootstrap .rcbScroll {
  padding: 5px 0 !important;
  background-color: #000 !important;
}

.RadComboBox_Bootstrap .rcbReadOnly .rcbInputCell {
  background-color: transparent !important;
}

#gvInventario_ctl00_ctl03_ctl01_PageSizeComboBox_Input {
  background-color: transparent;
  color: #e6edf3 !important;
}

.RadComboBox_Bootstrap .rcbReadOnly .rcbArrowCell.rcbArrowCellRight {
  background-color: #000 !important;
}

.RadComboBox_Bootstrap .rcbArrowCell a,
.rcCalPopup {
  filter: invert(1) !important;
}

.RadComboBox_Bootstrap .rcbHovered .rcbReadOnly .rcbInputCell {
  background-color: #383838 !important;
}

.main :where(.form-control, .custom-select) {
  border-color: #7575a3 !important;
}

.RadComboBox_Bootstrap .rcbFocused .rcbReadOnly .rcbInputCell {
  background-color: transparent !important;
  border-right: 1px solid !important;
}

.RadGrid_Bootstrap .rgAltRow .rgSorted {
  background-color: #222 !important;
}

.RadGrid_Bootstrap .rgSorted {
  background-color: #000000 !important;
}

.RadMenu_Bootstrap .rmGroup,
.RadMenu_Bootstrap.rmRoundedCorners .rmGroup,
.RadMenu_Bootstrap .rmMultiColumn {
  background-color: #000 !important;
  color: #e6edf3 !important;
}

.RadMenu_Bootstrap .rmGroup .rmLink {
  color: #e6edf3 !important;
}

html body .RadInput_Bootstrap .riHover,
html body .RadInput_Hover_Bootstrap {
  background-color: #000 !important;
  color: #e6edf3 !important;
  opacity: 0.5 !important;
}

html body .RadInput_Bootstrap .riTextBox,
html body .RadInputMgr_Bootstrap {
  background-color: #000 !important;
  color: #e6edf3 !important;
}

html body .RadInput_Bootstrap .riFocused,
html body .RadInput_Focused_Bootstrap {
  color: #e6edf3;
  background-color: #000000 !important;
}

.RadComboBox_Bootstrap .rcbInput {
  color: #b8b8b8 !important;
}

.GridContextMenu_Bootstrap .rgHCMClear,
.GridContextMenu_Bootstrap .rgHCMFilter {
  color: #e6edf3 !important;
  background-color: #000 !important;
  border-color: #7575a3 !important;
}

.rgPager .rgPagerCell .rgNumPart a {
  filter: invert(1) !important;
}

.RadGrid_Bootstrap .rgPagerCell .rgNumPart a.rgCurrentPage {
  background-color: #dcb133 !important;
  border: none !important;
}

#UpdatePanel > main > div.main-overview.row #inventario.bg-green {
  background-color: transparent !important;
}

#btnGuardarEnvio,
#btnEnviarEnvio,
#btnEnviarVScale {
  border-color: #7575a3 !important;
}

.sidenav,
.dropdown-menu {
  background-color: #000 !important;
  color: #e6edf3 !important;

  .dropdown-menu {
    background-color: #000 !important;
    border-color: #ccc !important;
  }

  .dropdown-item {
    color: #fff !important;
    opacity: 0.9 !important;
  }

  .dropdown-item:hover {
    opacity: 1 !important;
    color: rgb(230, 237, 243) !important;
    background-color: rgba(177, 186, 196, 0.12) !important;
  }

  .nav-link:hover {
    background-color: rgb(22, 27, 34) !important;
  }
}

.RadMenu_Bootstrap .rmRootGroup.rmHorizontal,
.RadMenu_Bootstrap .rmRootGroup.rmVertical,
.RadMenu_Bootstrap ul.rmRootScrollGroup {
  background-color: rgb(22, 27, 34) !important;
  border-color: transparent !important;
  border-bottom-color: #ccc !important;

  .rmRootLink {
    color: #e6edf3 !important;
  }

  .rmRootLink.rmExpanded {
    background-color: #000 !important;
  }

  .rmRootLink.rmSelected {
    opacity: 0.9 !important;
    background-color: #000 !important;
  }

  .rmRootLink:hover {
    color: #e6edf3 !important;
    background-color: #0a304e !important;
  }
}

#btnEliminar,
#btnEliminarPartidas {
  color: #dc3545 !important;
}

#btnEliminar:hover,
#btnEliminarPartidas:hover {
  opacity: 0.9 !important;
}

@media print {
  .rgPager .rgPagerCell .rgNumPart a,
  .RadComboBox_Bootstrap .rcbArrowCell a,
  .RadGrid_Bootstrap .rgPagerCell .rgArrPart1,
  .RadGrid_Bootstrap .rgPagerCell .rgArrPart2 {
    filter: invert(0) !important;
  }

  body {
    color: #000 !important;
  }

  .table-theme-blue tbody tr:nth-of-type(odd),
  .table-theme-purple tbody tr:nth-of-type(odd),
  tbody {
    color: #000 !important;
  }

  .table-hover tbody tr:hover {
    color: #000 !important;
    opacity: 1 !important;
  }
}

.nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
  color: rgb(230, 237, 243) !important;
  background-color: rgb(22, 27, 34) !important;
}

.RadLabel_Default {
  color: #e6edf3 !important;
}

.main-filtros {
  .RadComboBox_Bootstrap .rcbInputCell {
    color: #e6edf3 !important;
    background-color: #000 !important;
  }

  .RadComboBox_Bootstrap .rcbArrowCell a {
    background-color: #fff !important;
  }
}
.RadComboBoxDropDown label {
  color: #e6edf3 !important;
}

#cmbPrioridadB_DropDown > div > ul > li.rcbItem,
#cmbEstatus_DropDown > div > ul > li.rcbItem {
  opacity: 1 !important;
}

#gvPedidosAmazon {
  .rgHeader.rgCheck input,
  .check input,
  td input[type='checkbox'] {
    opacity: 0.5 !important;
  }
  .rgHeader.rgCheck input:hover,
  .check input:hove,
  td input[type='checkbox']:hover {
    opacity: 1 !important;
  }

  .rgAltRow,
  .rgAltRow {
    color: #e6edf3 !important;
  }

  .RadButton.rbDisabled {
    opacity: 1 !important;
  }

  .rgOptions {
    filter: invert(1) !important;
  }

  .rbLinkButton {
    background-color: transparent !important;
  }

  .rgExpandCol {
    background-color: #000 !important;
    input {
      filter: invert(1) !important;
    }
  }
}

#lblFecha::before {
  opacity: 0.8 !important;
}
#headerDropdown {
  border: none !important;
}

#gvPedidoListas,
#gvPedidosTienda {
  .rgCheck input,
  td input[type='checkbox'] {
    opacity: 0.5 !important;
  }
  .rgCheck input:hover,
  td input[type='checkbox']:hover,
  .rbDisabled {
    opacity: 1 !important;
  }

  tr td:nth-child(4) a:hover {
    font-weight: bold !important;
  }
  tr td:nth-child(4) a {
    color: #2f81f7 !important;
  }
  .riTextBox {
    background-color: transparent !important;
    color: #e6edf3 !important;
  }
  .RadButton_Bootstrap.rbSkinnedButton {
    background-color: transparent !important;
  }
  .rbDownload,
  input.rgOptions {
    filter: invert(1) !important;
  }
}

.RadUpload_Bootstrap .ruButton,
.RadUpload_Bootstrap .ruFakeInput {
  background: #000 !important;
  color: #848d97 !important;
  border-color: #7575a3 !important;
}

tr.rgSelectedRow input[type='checkbox'] {
  opacity: 1 !important;
}
`;

const styleGlobalElement = `<style id="styleGlobal"></style>`;

if (toggleState === 'true') {
  document.querySelector('body').insertAdjacentHTML('afterbegin', preLoaderBlackElement);
} else {
  document.querySelector('body').insertAdjacentHTML('afterbegin', preLoaderWhiteElement);
}

(() => {
  // Insertar estilos
  document.querySelector('body').insertAdjacentHTML('beforeend', styleGlobalElement);
  const styleElement = document.querySelector('#styleGlobal');

  // Verificar el valor en localStorage después de toggle
  if (toggleState === 'true') {
    styleElement.innerHTML = styleGobalCSS;
  }
})();

function incicio() {
  console.log('toggleSwitch.js');
  document.getElementById('preloader').style.display = 'none';
  const elementInsertDropdown = document.querySelector('.header .dropdown');
  const elementUl = document.querySelector('#RMReportes > ul');

  if (elementInsertDropdown) {
    elementInsertDropdown.insertAdjacentHTML('beforebegin', toggleSwitchElement);
  } else if (elementUl) {
    elementUl.insertAdjacentHTML('beforeend', toggleSwitchElement);
    setTimeout(() => {
      const toggleButtonContainer = document.querySelector('.toggle-switch');
      toggleButtonContainer && toggleButtonContainer.classList.add('sin-header');
    }, 50);
  }

  const toggleButton = document.querySelector('.toggle-switch input');

  if (toggleButton) {
    const styleElement = document.querySelector('#styleGlobal');
    if (!styleElement) {
      document.querySelector('body').insertAdjacentHTML('beforeend', styleGlobalElement);
      setTimeout(() => {
        const styleElement = document.querySelector('#styleGlobal');

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
      styleElement.innerHTML = styleGobalCSS;
    } else {
      localStorage.removeItem('toggleState'); // Eliminar del localStorage si no está marcado
      styleElement.innerHTML = '';
    }
  }
}

window.addEventListener('load', incicio, { once: true });
