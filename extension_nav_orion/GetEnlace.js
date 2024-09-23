class GetEnlace {
  constructor(enlaces = []) {
    this.enlaces = enlaces;
  }

  #createLink({ href, name }) {
    const li = document.createElement('li');
    const a = document.createElement('a');

    li.className = 'nav-item';
    a.className = 'nav-link';

    a.href = href;
    a.textContent = name;

    li.appendChild(a);
    return li;
  }

  #createUl() {
    const ul = document.createElement('ul');
    ul.className = 'nav nav-underline';
    return ul;
  }

  async getLinks() {
    if (this.enlaces.length === 0) {
      console.warn('No se encontraron enlaces para crear');
      return null;
    }

    const ul = this.#createUl();

    for (const { name, url } of this.enlaces) {
      const li = this.#createLink({ href: url, name });
      ul.appendChild(li);
    }

    return ul;
  }
}
