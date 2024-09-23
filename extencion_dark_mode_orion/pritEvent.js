class EventPrintManager {
  constructor() {
    this.dataBsTheme = '';
    this.themeChanged = false;

    this.printMap = {
      beforeprint: () => this.handleBefore(),
      afterprint: () => this.handleAfter(),
    };

    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener('beforeprint', this.eventManager.bind(this));
    window.addEventListener('afterprint', this.eventManager.bind(this));
  }

  removeEventListeners() {
    window.removeEventListener('beforeprint', this.eventManager.bind(this));
    window.removeEventListener('afterprint', this.eventManager.bind(this));
  }

  // Método para manejar los eventos de impresión
  eventManager(e) {
    const { type } = e;

    if (this.printMap[type]) {
      this.printMap[type]();
    } else {
      console.warn(`Unhandled event type: ${type}`);
    }
  }

  // Método privado para obtener el valor del tema actual
  #setdataBsTheme() {
    this.dataBsTheme = document.documentElement.getAttribute('data-bs-theme');
  }

  // Método que se ejecuta antes de imprimir
  handleBefore() {
    this.#setdataBsTheme(); // Obtener el tema actual
    console.log('Handling before print');

    // Cambiar a 'light' solo si el tema actual es 'dark'
    if (this.dataBsTheme === 'dark') {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      this.themeChanged = true; // Marcar que hemos cambiado el tema
    }
  }

  // Método que se ejecuta después de imprimir
  handleAfter() {
    if (this.themeChanged) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      this.themeChanged = false;
    }
  }
}

const managerEvent = new EventPrintManager();
