import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../product-card/index.js';

export default class ProductGrid {
  constructor(products) {
    this._products = products;
    this._filters = {};

    this._container = null;

    this._render();
  }

  get elem() {
    return this._container;
  }

  _render () {
    const template = productGridTemplate();

    this._container = createElement(template);
    this._addProducts(this._products);
  }

  _addProducts(products) {
    const wrapper = this._container.querySelector('.products-grid__inner');

    wrapper.innerHTML = '';

    products.forEach(product => {
      const card = new ProductCard(product).elem;
      wrapper.append(card);
    });
  }

  updateFilter(filters) {
    this._filters = Object.assign(this._filters, filters);

    const { noNuts = false, vegeterianOnly = false, maxSpiciness = 0, category = '' } = this._filters;
    const filteredProducts = this._products
      .filter(product => noNuts ? noNuts == !product.nuts : product)
      .filter(product => vegeterianOnly ? vegeterianOnly == product.vegeterian : product)
      .filter(product => maxSpiciness ? product.spiciness <= maxSpiciness : product )
      .filter(product => category ? category == product.category : product );

    this._addProducts(filteredProducts);
  }
}

function productGridTemplate() {
  return `
    <div class="products-grid">
      <div class="products-grid__inner"></div>
    </div>
  `;
}
