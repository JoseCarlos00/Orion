export class FormGropHidden {
	constructor() {
		this.hiddenGroupListElement = document.querySelector("#hidden-group-list");
		this.formGroupHidden = document.querySelector("#formGroupHidden");

		this.nameStorage = "hiddenGroupList";
		this.defaultHiddenGroup = new Set(["YY PROMO/BZ1", "ZMUEBLE TDAS", "YY TIAN5", "NAV MADERA"]);

		this.recoveryData = {};
		this.hiddenGroupList = new Set(this.recoveryData.hiddenGroupList || [...this.defaultHiddenGroup]);

		this.setDataListHiddenGroupStorage();
	}

	delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

	async render() {
		try {
			this.insertDataInDOM();
			this.setEventClickList();
			this.setEventFormSubmit();
		} catch (error) {
			console.error(error);
		}
	}

	insertDataInDOM() {
		if (!this.hiddenGroupListElement) {
			throw new Error("hiddenGroupListElement is not defined");
		}

		this.hiddenGroupListElement.innerHTML = "";

		if (this.hiddenGroupList.length === 0) {
			throw new Error("hiddenGroupList is empty");
		}

		Array.from(this.hiddenGroupList)
			.sort()
			.forEach((value) => {
				const liElement = this.getElementLi(value);
				this.hiddenGroupListElement.appendChild(liElement);
			});
	}

	handleDeleteGroup = (button) => {
		const liElement = button.closest("li");
		const value = button.dataset.value;

		if (!this.hiddenGroupList.has(value)) {
			return;
		}

		this.hiddenGroupList.delete(value);

		// Eliminar el elemento del DOM
		liElement.remove();
		this.saveDataListHiddenGroupStorage();
	};

	setEventClickList() {
		if (!this.hiddenGroupListElement) {
			throw new Error("hiddenGroupListElement is not defined");
		}

		this.hiddenGroupListElement.addEventListener("click", ({ target }) => {
			if (target.nodeName === "BUTTON" && target.classList.contains("button-delete")) {
				this.handleDeleteGroup(target);
			}
		});
	}

	handleEventSubmit = (e) => {
		e.preventDefault();
		const nameGroupValue = e.target.nameGroup?.value?.trim()?.toUpperCase();
		console.log(nameGroupValue);

		if (this.hiddenGroupList.has(nameGroupValue)) {
			console.warn("El grupo ya existe");
			return;
		}

		this.hiddenGroupList.add(nameGroupValue);
		this.saveDataListHiddenGroupStorage();
		this.insertDataInDOM();
		e.target.reset();
	};

	setEventFormSubmit() {
		if (!this.formGroupHidden) {
			throw new Error("formGroupHidden is not defined");
		}

		this.formGroupHidden.addEventListener("submit", this.handleEventSubmit);
	}

	getElementLi(value) {
		let li = document.createElement("li");
		li.className = "list-group-item";
		li.innerHTML = `
    <span class="truncate">${value}</span>
      <button class="button-delete transition-colors" data-value="${value}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-x h-4 w-4">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
        <span class="sr-only">Eliminar</span>
      </button>
    `;

		return li;
	}

	saveDataListHiddenGroupStorage() {
		// Guardar el Set como array en localStorage
		this.recoveryData.hiddenGroupList = Array.from(this.hiddenGroupList);
		localStorage.setItem(this.nameStorage, JSON.stringify(this.recoveryData));
	}

	setDataListHiddenGroupStorage() {
		const data = localStorage.getItem(this.nameStorage);

		if (data) {
			this.recoveryData = JSON.parse(data);
			// Convertir el array recuperado en un Set
			this.hiddenGroupList = new Set(this.recoveryData.hiddenGroupList || [...this.defaultHiddenGroup]);
		}
	}
}
