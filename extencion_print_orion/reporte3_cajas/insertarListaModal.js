async function insertarLIsta() {
	let datos = [];

	try {
		await insertarButtonListaAndExcel();
		setEventDownload();
		await insertarModal();
		await modalFunction();
	} catch (error) {
		console.error("Error:", error);
		return;
	}

	function insertarButtonListaAndExcel() {
		const buttons = `
     <div class="p-2 bd-highlight">
        <button id="insertList" type="button" class="btn btn-sm btn-purple mt-3 position-relative">
          <i class="fas fa-plus" aria-hidden="true"></i> Insertar Lista
        </button>
    </div>

    <div class="p-2 bd-highlight btn-excel">
      <button id="btnExcel2" class="btn btn-sm text-grey btn-purple mt-3" type=" button">
        <i class="fa-solid fa-file-excel" aria-hidden="true"></i>
        Bajar Excel</button>
    </div>  
      `;

		return new Promise((resolve, reject) => {
			const elementToInsert = document.querySelector(
				'#frmReciboListas > div.d-flex.bd-highlight.row > div.mr-auto.bd-highlight.col-sm-12.col-lg-auto'
			);

			if (elementToInsert) {
				elementToInsert.insertAdjacentHTML("beforebegin", buttons);

				setTimeout(resolve, 50);
			} else {
				console.log(new Error("No se encontroe el elemento a insertar: Button Insert List"));
				reject();
			}
		});
	}

	function insertarModal() {
		const htmlModal = `
      <section class="modal-container-insert">
        <div id="myModalInserToItem" class="modal">
          <div class="modal-content">

            <button type="button" aria-label="Close" data-balloon-pos="left" class="close">
              <svg aria-hidden="true" focusable="false" data-prefix="fad" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="fa-circle-xmark">
                <path fill="currentColor"
                  d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
                  class="fa-secondary"></path>
                <path fill="currentColor"
                  d="M209 175c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47z"
                  class="fa-primary"></path>
              </svg>
            </button>

            <form id="FormInsertItem" action="" class="insertar-item">
              <label for="insertItems">Insertar Items
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-success ml-1" id="countInsertItem">
                  0
                  <span class="visually-hidden">item total</span>
                  </span>
              </label>              
              <textarea id="insertItems" name="itemsRegisters" required placeholder="9413-6209-34996\n9238-8384-6456"></textarea>

              <div class="form-buttons">
                <button class="btn btn-primary" type="submit">
                  <span class="text">Registrar</span>
                </button>

                <button id="clearInsertitems" class="btn btn-danger btn-sm" type="reset" aria-label="Limpiar" data-balloon-pos="right">
                  <i class="fas fa-trash-can" aria-hidden="true"></i>
                </button>                
              </div>
            </form>

          </div>
        </div>
      </section>
    `;

		return new Promise((resolve, reject) => {
			const body = document.querySelector("body");

			if (!body) {
				console.error("Error: no se encontro el Body");
				reject();
				return;
			}

			body.insertAdjacentHTML("beforeend", htmlModal);
			setTimeout(resolve, 50);
		});
	}

	function modalFunction() {
		return new Promise((resolve, reject) => {
			const modalInsert = document.getElementById("myModalInserToItem");
			const btnOpenModal = document.getElementById("insertList");
			const btnCloseModal = document.querySelector(".modal-container-insert .close");

			if (!modalInsert || !btnOpenModal || !btnCloseModal) {
				console.error("No exiten los elementos del modal");
				reject();
				return;
			}

			setEventListeners({ modalInsert, btnCloseModal, btnOpenModal });
			resolve();
		});
	}

	function setEventModal(elements) {
		const { modalInsert, btnCloseModal, btnOpenModal } = elements;

		const textarea = document.getElementById("insertItems");
		const inputReset = document.getElementById("clearInsertitems");

		if (textarea && inputReset) {
			textarea.addEventListener("input", () => updateCountForm(textarea));
			inputReset.addEventListener("click", () => updateCountForm(textarea));
		}

		// Cuando el usuario hace clic en el botón, abre el modal
		btnOpenModal.addEventListener("click", () => openModalAction({ textarea, modalInsert }));

		// Cuando el usuario hace clic en <span> (x), cierra el modal
		btnCloseModal.addEventListener("click", function () {
			modalInsert.style.display = "none";
		});
	}

	async function openModalAction({ modalInsert, textarea }) {
		modalInsert.style.display = "block";

		if (!textarea) return;

		textarea.focus();
		updateCountForm(textarea);
	}

	function updateCountForm(textarea) {
		setTimeout(() => {
			console.log("[updateCountForm]");
			const badgeCount = document.getElementById("countInsertItem");
			const textareaValue = textarea.value.trim();
			const lineas = textareaValue == "" ? 0 : textareaValue.split("\n").length;

			if (badgeCount) {
				badgeCount.innerHTML = `${lineas}<span class="visually-hidden">item total</span>`;
			}
		}, 50);
	}

	function setEventListeners(elements) {
		const { modalInsert } = elements;
		setEventModal(elements);

		const formInsertItems = document.getElementById("FormInsertItem");
		formInsertItems && formInsertItems.addEventListener("submit", registrarDatos);

		setEventContadores();

		const textarea = document.getElementById("insertItems");

		// Cuando el usuario hace clic fuera del modal, ciérralo
		window.addEventListener("click", function (e) {
			const element = e.target;

			if (element == modalInsert) {
				modalInsert.style.display = "none";
			}
		});

		// Cuando el usuario apreta la tecla Esc, ciérralo
		window.addEventListener("keydown", function (e) {
			if (e.key === "Escape") {
				if (modalInsert.style.display === "block") {
					modalInsert.style.display = "none";
				}
			}
		});
	}

	function setEventContadores() {
		const table = document.getElementById("gvPedidosTienda_ctl00");

		if (!table) {
			console.error("Error: No se encontro el elemento [table]");
			return;
		}

		// Contadores
		table.addEventListener("click", clickEventCheckBox);
	}

	function clickEventCheckBox(e) {
		const nodeName = e.target.nodeName;
		const type = e.target.type;

		if (nodeName === "INPUT" && type === "checkbox") {
			console.log("Actualizar Contadores");

			counterUpdate().then(() => {
				console.log("Contadores actualizados");
			});
		}
	}

	function counterUpdate() {
		return new Promise((resolve) => {
			const checkBoxSeleccionadosNum = obtenerCheckboxesSeleccionados();
			// Aquí puedes realizar la actualización de los contadores basada en `seleccionados`
			// Ejemplo:
			console.log(`Total de checkboxes seleccionados: ${checkBoxSeleccionadosNum}`);
			// Lógica adicional para actualizar contadores...
			resolve();
		});
	}

	function obtenerCheckboxesSeleccionados() {
		const checkboxesSeleccionados = document.querySelectorAll(
			'#gvPedidosTienda_ctl00 tr input[type="checkbox"]:not(#gvPedidosTienda_ctl00_ctl02_ctl01_CheckSelectCheckBox):checked'
		);
		return checkboxesSeleccionados.length;
	}

	function insertarItems() {
		let itemsRegistrados = 0;

		if (datos.length === 0) {
			console.warn("Array de datos vacia");
			closeModal();
			return;
		}

		const tbody = document.querySelector("#gvPedidosTienda_ctl00 > tbody");
		const rows = Array.from(tbody.querySelectorAll("tr"));

		if (rows.length === 0) {
			console.warn("Filas de la tabla vacia");
			closeModal();
			return;
		}

		rows.forEach((row) => {
			const inputCheckbox = row.querySelector('td[valign="middle"] input[type="checkbox"]');
			const item = row.querySelector("td:nth-child(2)");
			const itemText = item ? item.textContent.trim() : "";

			if (datos.includes(itemText) && inputCheckbox) {
				inputCheckbox.click();
				itemsRegistrados++;
			}
		});

		// Filas insertadas
		badgleButtonList({ itemsRegistrados, total: datos.length });
		closeModal();

		// Cerrar modal
		closeModal();
	}

	function closeModal() {
		setTimeout(() => {
			const modal = document.getElementById("myModalInserToItem");
			modal && (modal.style.display = "none");
		}, 150);
	}

	async function registrarDatos(e) {
		e.preventDefault();

		const formItem = e.target;
		const textarea = formItem.itemsRegisters;

		if (!formItem || !textarea) return console.error("Error: no se encontro el formulario insertItem");

		const continuar = await verificarLineas();

		if (continuar) {
			console.warn("Se ha detenido la ejecucion");
			deleteBadgle();
			closeModal();
			return;
		}

		// limpiamos los datos almacenados anteriormente
		datos.length = 0;

		// Dividir el texto en lineas
		const lineas = textarea.value.trim().split("\n");

		// Procesar cada linea
		lineas.forEach((linea) => {
			const regex = /^(\d+-\d+-\d+),?\s*$/;
			const match = linea.match(regex);

			if (match) {
				const item = match[1];

				/**
				 * Si el item a registrar ya existe en el array,o si se intenta registrar mas de una vez el mismo ITEM.
				 * No de agrega al array
				 */
				if (!datos.includes(item)) {
					datos.push(item);
				}
			}
		});

		// Limpiar el campo de texto
		formItem.reset();

		// Insertar datos
		insertarItems();
	}

	function badgleButtonList({ itemsRegistrados = 0, total = 0 } = {}) {
		const button = document.getElementById("insertList");
		const badgleOld = document.getElementById("badgleItem");

		// Crear el badge
		const badgeNew = document.createElement("span");
		badgeNew.className = "position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger";
		badgeNew.id = "badgleItem";
		badgeNew.innerHTML = `${total}<span class="msg"> total</span><span class="visually-hidden">item total</span>`;

		// Agregar el badge al botón
		if (badgleOld) {
			button.replaceChild(badgeNew, badgleOld);
		} else {
			button.insertAdjacentElement("beforeend", badgeNew);
		}

		// Actualizar el contenido del badge
		setTimeout(() => {
			badgeNew.innerHTML = `${itemsRegistrados}<span class="msg"> registrados</span><span class="visually-hidden">item registrados</span>`;
		}, 2000);
	}

	function deleteBadgle() {
		const badgle = document.getElementById("badgleItem");

		if (!badgle) {
			console.error("Error: no se encontro el elemento [badgle]");
			return;
		}

		badgle.remove();
	}
}

async function verificarLineas() {
	console.log("[verificarLineas] se ha ejecutado");

	const totalNumber = obtenerTotalNumber();
	const numFilas = obtenerNumFilas();

	if (numFilas === null || totalNumber === null) {
		console.warn("Error al obtener el número de filas o el total.");
		alert("Ha ocurrido un error inesperado code:001");
		return false;
	}

	if (esImpresionCompleta(numFilas, totalNumber)) {
		return false;
	}

	// Maneja filas incompletas y espera a que se resuelva la promesa
	const result = await manejarFilasIncompletas(numFilas, totalNumber);
	return result;
}

async function manejarFilasIncompletas(numFilas, totalNumber) {
	return new Promise(async (resolve) => {
		if (numFilas <= totalNumber) {
			const userResponse = confirm(
				"❌ No están activadas todas las líneas\n" +
					"¿Desea continuar?\n" +
					"     ⚠️                                                                      Sí        /        No"
			);

			if (userResponse) {
				await insertarMessageIncompletePrint(); // Espera a que se resuelva la promesa
				resolve(false); // El usuario decide continuar
			} else {
				activarFilas = true;
				console.log("activarFilas = true");
				resolve(true); // El usuario decide no continuar
				setTimeout(activartodasLasLineas, 50);
			}
		} else {
			resolve(false); // El número de filas es mayor al total
		}
	});
}

function setValueSessionStorage(value) {
	// Guardar en sessionStorage
	sessionStorage.setItem("insertItemValues", value);
}

function getValueSessionStorage() {
	return new Promise((resolve) => resolve(sessionStorage.getItem("insertItemValues") ?? ""));
}
