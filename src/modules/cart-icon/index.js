import createElement from '../../assets/lib/create-element.js';

export default class CartIcon {
  constructor() {
    this.minTopCoordinate = null;
    this.render();

    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');

      this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart.getTotalPrice().toFixed(2)}</span>
        </div>`;

      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});

    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  updatePosition() {
    if (!this.elem.offsetHeight) return false;

    let isMobile = document.documentElement.clientWidth <= 767;
    let styles = this.getStyles();

    if (!this.minTopCoordinate) {
      this.minTopCoordinate = this.elem.getBoundingClientRect().top + window.pageYOffset;
    }

    if (isMobile || window.pageYOffset <= this.minTopCoordinate) {
      this.resetStyles(styles);
    }

    Object.assign(this.elem.style, styles);
  }

  getStyles() {
    let leftCoordinate = Math.min(
      document.querySelector('.container').getBoundingClientRect().right + 20,
      document.documentElement.clientWidth - this.elem.offsetWidth - 10
    );

    return {
      position: 'fixed',
      top: '50px',
      right: '10px',
      left: leftCoordinate + 'px',
      zIndex: 100
    }
  }

  resetStyles(styles) {
    for (let key in styles) {
      styles[key] = '';
    }
  }
}
