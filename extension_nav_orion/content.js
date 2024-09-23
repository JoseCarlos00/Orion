async function main() {
  try {
    const elementToInsert = document.querySelector('body header.header > h1');

    if (!elementToInsert) {
      throw new Error('No se encontró el elemento <h1> en .header para insertar el menú.');
    }

    const ul = await getMenuNav();

    if (!ul || !(ul instanceof HTMLUListElement)) {
      throw new Error('No se encontró o el elemento <ul> no es válido para insertar.');
    }

    const ulContainer = document.createElement('div');
    ulContainer.className = 'nav-container';
    ulContainer.appendChild(ul);

    elementToInsert.insertAdjacentElement('beforebegin', ulContainer);
  } catch (error) {
    console.error('Error: Ocurrió un error al crear e insertar el menú de navegación:', error);
    // Opcional: notificar al usuario
  }
}

const enlaces = [
  {
    name: 'Lista de Envios',
    url: 'http://fmorion.dnsalias.com/orion/paginas/Envios/EnviosListas.aspx',
  },
  {
    name: 'Inventario Separado N',
    url: 'http://fmorion.dnsalias.com/orion/paginas/Medidas/InventarioSeparadoN.aspx',
  },
  {
    name: 'Reportes Bodega',
    url: 'http://fmorion.dnsalias.com/orion/paginas/Bodega/TrabajosActivos.aspx',
  },
  {
    name: 'Productos 3 Cajas Tultitlan',
    url: 'http://fmorion.dnsalias.com/orion/paginas/Bodega/Productos3Cajas.aspx',
  },
  {
    name: 'Pedidos de Tienda',
    url: 'http://fmorion.dnsalias.com/orion/paginas/Bodega/BodegaPedidosTienda.aspx',
  },
];

async function getMenuNav() {
  const navCreate = new GetEnlace(enlaces);
  const ul = await navCreate.getLinks();

  if (!(ul instanceof HTMLUListElement)) {
    throw new Error('La función getLinks no devolvió un <ul> válido.');
  }

  return ul;
}

window.addEventListener('load', main, { once: true });
