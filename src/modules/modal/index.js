import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    this._container = null;

    this._render();
  }

  setTitle(title) {
    this._container.querySelector('.modal__title').innerHTML = title;
  }

  setBody(body) {
    const modalBody = this._container.querySelector('.modal__body');

    modalBody.innerHTML = '';
    modalBody.append(body);
  };

  _render(parent) {
    const template = modalTemplate({ title: this._title });
    this._container = createElement(template);
  }

  _addEventListeners() {
    const buttonClose = this._container.querySelector('.modal__close');

    buttonClose.addEventListener('click', () => this.close(), { once: true });
    document.addEventListener('keydown', this._onKeyDownEscape);
  }

  _onKeyDownEscape = (e) => {
    if (e.code == 'Escape') this.close();
  }

  open() {
    document.body.append(this._container);
    document.body.classList.add('is-modal-open');
    this._addEventListeners();
  }

  close() {
    document.body.classList.remove('is-modal-open');
    this._container.remove();
    document.removeEventListener('keydown', this._onKeyDownEscape);
  }
}

function modalTemplate({ title = ''} = {}) {
  return `
    <div class="modal">
      <div class="modal__overlay"></div>

      <div class="modal__inner">
        <div class="modal__header">
          <button type="button" class="modal__close">
            <img src="src/assets/images/icons/cross-icon.svg" alt="close-icon" />
          </button>

          <h3 class="modal__title"></h3>

          <div class="modal__body"></div>
        </div>
      </div>
    </div>
  `;
}
