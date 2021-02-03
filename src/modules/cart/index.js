import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../modal/index.js';

export default class Cart {
  cartItems = [];

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this.modal = new Modal();

    this.addEventListeners();
  }

  addProduct(product) {
    let currentItem = this.cartItems.find(item => item.product.id == product.id);

    if (currentItem) {
      currentItem.count++;
    } else {
      currentItem = {
        product: product,
        count: 1
      };
      this.cartItems.push(currentItem);
    }

    this.onProductUpdate(currentItem);
  }

  updateProductCount(productId, amount) {
    let currentItem = this.cartItems.find(item => item.product.id == productId);

    currentItem.count += amount;

    if (currentItem.count == 0) {
      this.cartItems.splice([this.cartItems.indexOf(currentItem)], 1);
    }

    this.onProductUpdate(currentItem);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((totalCount, item) => totalCount + item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((totalPrice, item) => totalPrice + item.product.price * item.count, 0);
  }

  renderProduct(product, count) {
    return createElement(`
      <div class="cart-product" data-product-id="${
        product.id
      }">
        <div class="cart-product__img">
          <img src="src/assets/images/products/${product.image}" alt="product">
        </div>
        <div class="cart-product__info">
          <div class="cart-product__title">${escapeHtml(product.name)}</div>
          <div class="cart-product__price-wrap">
            <div class="cart-counter">
              <button type="button" class="cart-counter__button cart-counter__button_minus">
                <img src="src/assets/images/icons/square-minus-icon.svg" alt="minus">
              </button>
              <span class="cart-counter__count">${count}</span>
              <button type="button" class="cart-counter__button cart-counter__button_plus">
                <img src="src/assets/images/icons/square-plus-icon.svg" alt="plus">
              </button>
            </div>
            <div class="cart-product__price">€${(product.price * count).toFixed(2)}</div>
          </div>
        </div>
      </div>
    `);
  }

  renderOrderForm() {
    return createElement(`
      <form class="cart-form">
        <h5 class="cart-form__title">Delivery</h5>
        <div class="cart-form__group cart-form__group_row">
          <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
          <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
          <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
        </div>
        <div class="cart-form__group">
          <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
        </div>
        <div class="cart-buttons">
          <div class="cart-buttons__buttons btn-group">
            <div class="cart-buttons__info">
              <span class="cart-buttons__info-text">total</span>
              <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
            </div>
            <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
          </div>
        </div>
      </form>
    `);
  }

  renderModal() {
    const body = createElement('<div></div>');
    const products = this.cartItems.map(item => this.renderProduct(item.product, item.count));
    const orderForm = this.renderOrderForm();

    products.forEach(product => body.append(product));
    body.append(orderForm);

    this.modal.setTitle('Your order');
    this.modal.setBody(body);
    this.modal.open();

    body.addEventListener('click', this.onProductClick);
    orderForm.addEventListener('submit', this.onSubmit);
  }

  onProductClick = (e) => {
    const button = e.target.closest('.cart-counter__button');

    if (!button) return false;

    const product = button.closest('.cart-product').dataset.productId;

    if (button.classList.contains('cart-counter__button_minus')) {
      this.updateProductCount(product, -1);
    }

    if (button.classList.contains('cart-counter__button_plus')) {
      this.updateProductCount(product, 1);
    }
  }

  onProductUpdate(cartItem) {
    if (document.body.classList.contains('is-modal-open')) {
      const productId = cartItem.product.id;
      const modalBody = document.querySelector('.modal__body');
      const product = modalBody.querySelector(`[data-product-id="${productId}"]`);
      const productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
      const productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
      const infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);

      if (cartItem.count == 0) {
        product.remove();
      }

      if (this.getTotalCount() == 0) {
        this.modal.close();
      }

      productCount.innerHTML = cartItem.count;
      productPrice.innerHTML = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`;
      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;
    }

    this.cartIcon.update(this);
  }

  onSubmit = async (e) => {
    e.preventDefault();

    const form = document.querySelector('.cart-form');
    const buttonSubmit = form.querySelector('[type="submit"]');

    buttonSubmit.classList.add('is-loading');

    let response = await fetch('https://httpbin.org/post', {
      method: 'POST',
      body: new FormData(form)
    });

    if (response.ok) {
      this.cartItems.length = 0;
      this.modal.setTitle('Success!');
      this.modal.setBody(createElement(`
        <div class="modal__body-inner">
          <p>
            Order successful! Your order is being cooked :)
            <br>
            We’ll notify you about delivery time shortly.
            <br>
            <img src="src/assets/images/delivery.gif">
          </p>
        </div>
      `));
    }
  };

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

