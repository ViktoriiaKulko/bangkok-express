import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this._carouselInner = null;
    this._arrowRight = null;
    this._arrowLeft = null;
    this._button= null;
    this._currentPosition = 0;
    this._currentSlide = 1;

    this._onArrowLeftClick = this._onArrowLeftClick.bind(this);
    this._onArrowRightClick = this._onArrowRightClick.bind(this);
    this._onCarouselInnerClick = this._onCarouselInnerClick.bind(this);

    this.elem = this._render();
  }

  get slideWidth() {
    return this._carouselInner.querySelector('.carousel__slide').offsetWidth;
  }

  _render() {
    const carousel = createElement(carouselTemplate({
      slides: this.slides
    }));

    this._arrowRight = carousel.querySelector('.carousel__arrow_right');
    this._arrowLeft = carousel.querySelector('.carousel__arrow_left');
    this._carouselInner = carousel.querySelector('.carousel__inner');

    this._toggleButtonsVisibility();
    this._addEventListeners();

    return carousel;
  }

  _addEventListeners() {
    this._arrowLeft.addEventListener('click', this._onArrowLeftClick);
    this._arrowRight.addEventListener('click', this._onArrowRightClick);
    this._carouselInner.addEventListener('click', this._onCarouselInnerClick);
  }

  destroy() {
    this._arrowLeft.removeEventListener('click', this._onArrowLeftClick);
    this._arrowRight.removeEventListener('click', this._onArrowRightClick);
    this._carouselInner.removeEventListener('click', this._onCarouselInnerClick);
    this.elem.remove();
  }

  _onArrowLeftClick() {
    this._currentPosition += this.slideWidth;
    this._currentSlide--;
    this._manageSlider();
  }

  _onArrowRightClick() {
    this._currentPosition -= this.slideWidth;
    this._currentSlide++;
    this._manageSlider();
  }

  _onCarouselInnerClick(e) {
    const target = e.target;

    if(!target.closest('.carousel__button')) return;

    const event = new CustomEvent('product-add', {
      detail: target.closest('.carousel__slide').dataset.id,
      bubbles: true
    });

    this.elem.dispatchEvent(event);
  }

  _manageSlider() {
    this._carouselInner.style.transform = `translateX(${this._currentPosition}px)`;
    this._toggleButtonsVisibility();
  }

  _toggleButtonsVisibility() {
    this._arrowLeft.style.display = this._currentSlide <= 1 ? 'none' : 'flex';
    this._arrowRight.style.display = this._currentSlide >= this.slides.length ? 'none' : 'flex';
  }
}

function carouselTemplate({ slides = []} = {}) {
  return `
    <div class="carousel">
      <div class="carousel__arrow carousel__arrow_right">
        <img src="src/assets/images/icons/angle-icon.svg" alt="icon">
      </div>
      <div class="carousel__arrow carousel__arrow_left">
        <img src="src/assets/images/icons/angle-left-icon.svg" alt="icon">
      </div>
      <div class="carousel__inner">
        ${slides
          .map(slide => slideTemplate({
              id: slide.id,
              image: slide.image,
              price: slide.price,
              name: slide.name
            })
          )
          .join('')
        }
      </div>
    </div>
  `;
}

function slideTemplate({ id = '', image = '', price = '', name = '' } = {}) {
  return `
    <div class="carousel__slide" data-id="${id}">
      <img src="src/assets/images/carousel/${image}" class="carousel__img" alt="slide">
      <div class="carousel__caption">
        <span class="carousel__price">€${price.toFixed(2)}</span>
        <div class="carousel__title">${name}</div>
        <button type="button" class="carousel__button">
          <img src="src/assets/images/icons/plus-icon.svg" alt="icon">
        </button>
      </div>
    </div>
  `;
}
