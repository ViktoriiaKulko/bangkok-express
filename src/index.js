import './index.css';

import Carousel from './modules/carousel/index.js';
import slides from './modules/carousel/slides.js';

import RibbonMenu from './modules/ribbon-menu/index.js';
import categories from './modules/ribbon-menu/categories.js';

import StepSlider from './modules/step-slider/index.js';
import ProductsGrid from './modules/products-grid/index.js';

import CartIcon from './modules/cart-icon/index.js';
import Cart from './modules/cart/index.js';

export default class Main {

  constructor() {
    this.carousel = null;
    this.ribbonMenu = null;
    this.stepSlider = null;
    this.cartIcon = null;
    this.cart = null;
    this.productsGrid = null;
    this.products = null;
  }

  async render() {
    this.carousel = new Carousel(slides);
    document.querySelector('[data-carousel-holder]').append(this.carousel.elem);
    this.ribbonMenu = new RibbonMenu(categories);
    document.querySelector('[data-ribbon-holder]').append(this.ribbonMenu.elem);
    this.stepSlider = new StepSlider({ steps: 5, value: 3 });
    document.querySelector('[data-slider-holder]').append(this.stepSlider.elem);
    this.cartIcon = new CartIcon();
    document.querySelector('[data-cart-icon-holder]').append(this.cartIcon.elem);
    this.cart = new Cart(this.cartIcon);

    await this.showProducts();

    this.productsGrid.updateFilter({
      noNuts: document.getElementById('nuts-checkbox').checked,
      vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
      maxSpiciness: this.stepSlider.value,
      category: this.ribbonMenu.value
    });

    this.addEventListeners();
  }

  async getProducts() {
    try {
      const response = await fetch('products.json');
      let products = [];

      if (response.ok) {
        products = await response.json();
      }
      return products;

    } catch(err) {
      console.log(`Ошибка: ${err.name} ${err.message}`);
    } 
  }

  async showProducts() {
    this.products = await this.getProducts();
    const productsGridHolder = document.querySelector('[data-products-grid-holder]');
    
    this.productsGrid = new ProductsGrid(this.products);

    productsGridHolder.innerHTML = '';
    productsGridHolder.append(this.productsGrid.elem);
  }

  addEventListeners() {
    this.onProductAdd();
    this.onSliderChange();
    this.onRibbonSelect();
    this.onCheckboxesChange();
  }

  onProductAdd() {
    document.body.addEventListener('product-add', (event) => {
      const productId = event.detail;
      const chosenProduct = this.products.find(product => product.id == productId);

      this.cart.addProduct(chosenProduct);
    });
  }

  onSliderChange() {
    this.stepSlider.elem.addEventListener('slider-change', (event) => {
      const value = event.detail;

      this.productsGrid.updateFilter({
        maxSpiciness: value
      });
    });
  }

  onRibbonSelect() {
    this.ribbonMenu.elem.addEventListener('ribbon-select', (event) => {
      const categoryId = event.detail;

      this.productsGrid.updateFilter({
        category: categoryId
      });
    });
  }

  onCheckboxesChange() {
    const nutsCheckbox = document.querySelector('#nuts-checkbox');
    const vegeterianCheckbox = document.querySelector('#vegeterian-checkbox');

    nutsCheckbox.addEventListener('change', () => {
      this.productsGrid.updateFilter({
        noNuts: nutsCheckbox.checked
      });
    });

    vegeterianCheckbox.addEventListener('change', () => {
      this.productsGrid.updateFilter({
        vegeterianOnly: vegeterianCheckbox.checked
      });
    });
  }
}
