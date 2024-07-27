async function showInventoryTuti() {
  const PASSWORD = 'TULTI';
  let authorizationUser = '';

  try {
    await insertElementShowInventoryTuti();

    eventCheckBokShowInventoryTulti();
  } catch (error) {
    console.error('Error:', error);
  }

  function insertElementShowInventoryTuti() {
    return new Promise((resolve, reject) => {
      const elementToInsert = document.querySelector('#frmConsultaMiodani > main > h1');
      if (!elementToInsert) {
        console.error('No existe el elemento [h1]');
        reject();
        return;
      }

      elementToInsert.innerHTML =
        '<label id="insertInventoryTulti"><input type="checkbox"><small>Inventario por Bodega</small></label>';
      setTimeout(resolve, 50);
    });
  }

  function eventCheckBokShowInventoryTulti() {
    const btnInsertKey = document.querySelector('#insertInventoryTulti');
    const table = document.querySelector('#gvInventario_ctl00');

    if (btnInsertKey) {
      btnInsertKey.addEventListener('change', () => eventChange({ table, btnInsertKey }));
    }
  }

  function validateAuthorization() {
    const passworInSessionStorage = getValueSessionStorage();

    return new Promise(resolve => {
      if (
        authorizationUser.toLocaleLowerCase() === PASSWORD.toLocaleLowerCase() ||
        passworInSessionStorage.toLocaleLowerCase() === PASSWORD.toLocaleLowerCase()
      ) {
        resolve(true);
        return;
      }
      const key = prompt('Ingrese una contraseña valida') ?? '';
      authorizationUser = key.trim();
      setValueSessionStorage(authorizationUser);

      if (key.toLocaleLowerCase() === PASSWORD.toLocaleLowerCase()) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  async function eventChange({ table, btnInsertKey }) {
    if (!table) {
      console.error('Error: no existe el elemento table');
      return;
    }

    const authorization = await validateAuthorization();
    console.log('event:', authorization);

    if (authorization) {
      table.classList.toggle('show-inventory-tulti', btnInsertKey.checked);
    }
  }
}

function setValueSessionStorage(value) {
  // Guardar en sessionStorage
  sessionStorage.setItem('passwordInventory', value);
}

function getValueSessionStorage() {
  return sessionStorage.getItem('passwordInventory') || '';
}
