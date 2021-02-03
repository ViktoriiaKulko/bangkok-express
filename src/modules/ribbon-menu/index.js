import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this._categories = categories;
    this._scrollStep = 350;

    this._container = null;
    this._menu = null;
    this._arrowLeft = null;
    this._arrowRight = null;

    this._render();
  }

  get elem() {
    return this._container;
  }

  _render() {
    const template = ribbonMenuTemplate({
      categories: this._categories
    });

    this._container = createElement(template);
    this._initElems(this._container);
    this._addEventListeners();
  }

  _initElems(container) {
    this._menu = container.querySelector('.ribbon__inner');
    this._arrowLeft = container.querySelector('.ribbon__arrow_left');
    this._arrowRight = container.querySelector('.ribbon__arrow_right');
  }

  _addEventListeners() {
    this._arrowLeft.addEventListener('click', () => {
      this._menu.scrollBy(-this._scrollStep, 0);
    });

    this._arrowRight.addEventListener('click', () => {
      this._menu.scrollBy(this._scrollStep, 0);
    });

    this._menu.addEventListener('scroll', () => {
      const scrollLeft = this._menu.scrollLeft != 0;
      const scrollRight = this._menu.scrollWidth - this._menu.scrollLeft - this._menu.clientWidth;

      this._arrowLeft.classList.toggle('ribbon__arrow_visible', scrollLeft);
      this._arrowRight.classList.toggle('ribbon__arrow_visible', scrollRight);
    });

    this._menu.addEventListener('click', (e) => {
      const selectedItem = e.target;
      const event = new CustomEvent('ribbon-select', {
        detail: selectedItem.dataset.id,
        bubbles: true
      });

      [...this._menu.children]
        .find(elem => elem.classList.contains('ribbon__item_active'))
        .classList.remove('ribbon__item_active');

      selectedItem.classList.add('ribbon__item_active');

      this._container.dispatchEvent(event);
    });
  }
}

function ribbonMenuTemplate({ categories } = {}) {
  return `
    <div class="ribbon">
      <button class="ribbon__arrow ribbon__arrow_left">
        <img src="src/assets/images/icons/angle-icon.svg" alt="icon">
      </button>

      <nav class="ribbon__inner">
        ${categories
          .map((category, index) => 
            `<a
              href="#"
              class="ribbon__item ${index == 0 ? `ribbon__item_active` : ''}"
              data-id="${category.id}"
            >${category.name}</a>`)
          .join('')
        }
      </nav>

      <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
        <img src="src/assets/images/icons/angle-icon.svg" alt="icon">
      </button>
    </div>
  `;
}
