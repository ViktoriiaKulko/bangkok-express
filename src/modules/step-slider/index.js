import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.value = value;
    this._steps = steps;
    this._currentValue = value;
    this._valueDinamicPercents = null;

    this._container = null;
    this._thumb = null;
    this._thumbValue = null;
    this._stepMarks = null;
    this._progress = null;

    this._render();
  }

  get elem() {
    return this._container;
  }

  get _segments() {
    return this._steps - 1;
  }

  get _valueSegmentsPercents() {
    return this._currentValue * 100 / this._segments;
  }

  _render() {
    const template = sliderTemplate({
      steps: this._steps,
      value: this._currentValue,
      valuePercents: this._valueSegmentsPercents
    });

    this._container = createElement(template);
    this._changeSlider();
  }

  _changeSlider() {
    this._initElems();
    this._addEventListeners();
  }

  _initElems() {
    this._thumb = this._container.querySelector('.slider__thumb');
    this._thumbValue = this._container.querySelector('.slider__value');
    this._progress = this._container.querySelector('.slider__progress');
    this._stepMarks = [...this._container.querySelector('.slider__steps').children];
  }

  _addEventListeners() {
    this._container.addEventListener('click', this._onContainerClick);
    this._thumb.addEventListener('pointerdown', this._onThumbPointerDown);
    this._thumb.addEventListener('dragstart', () => false);
  }

  _onContainerClick = (e) => {
    this._removeActiveStepMark();
    this._setCurrentParams(e);
    this._addActiveStepMark();
    this._displayChange(this._valueSegmentsPercents);
    this._createSliderChangeEvent();
  }

  _onThumbPointerDown = (e) => {
    e.preventDefault();
    this._container.classList.add('slider_dragging');
    this._removeActiveStepMark();
    document.addEventListener('pointermove', this._onDocumentPointerMove);
    document.addEventListener('pointerup', this._onDocumentPointerUp);
  }

  _onDocumentPointerMove = (e) => {
    this._setCurrentParams(e);
    this._displayChange(this._valueDinamicPercents);
    this._createSliderChangeEvent();
  }

  _onDocumentPointerUp = () => {
    this._displayChange(this._valueSegmentsPercents);
    this._addActiveStepMark();
    this._createSliderChangeEvent();
    this._container.classList.remove('slider_dragging');
    document.removeEventListener('pointermove', this._onDocumentPointerMove);
  }

  _setCurrentParams(e) {
    let left = e.clientX - this._container.getBoundingClientRect().left;
    let leftRelative = left / this.elem.offsetWidth;

    if (leftRelative < 0) leftRelative = 0;
    if (leftRelative > 1) leftRelative = 1;

    this._valueDinamicPercents = leftRelative * 100;
    this._currentValue = Math.round(leftRelative * this._segments);
  }

  _displayChange(percents) {
    this._thumbValue.textContent = this._currentValue;
    this._thumb.style.left = percents + '%';
    this._progress.style.width = percents + '%';
  }

  _removeActiveStepMark() {
    this._stepMarks[this ._currentValue].classList.remove('slider__step-active');
  }

  _addActiveStepMark() {
    this._stepMarks[this ._currentValue].classList.add('slider__step-active');
  }

  _createSliderChangeEvent() {
    const event = new CustomEvent('slider-change', {
      detail: this._currentValue,
      bubbles: true
    });

    this._container.dispatchEvent(event);
  }
}

function sliderTemplate({steps = 0, value = 0, valuePercents = 0} = {}) {
  let stepsTemplate = '';

  for (let i = 0; i < steps; i++) {
    stepsTemplate += `<span class="${ value == i ? 'slider__step-active' : '' }"></span>`;
  }

  return `
    <div class="slider">
      <div class="slider__thumb" style="left: ${ valuePercents }%;">
        <span class="slider__value">${ value }</span>
      </div>

      <div class="slider__progress" style="width: ${ valuePercents }%;"></div>

      <div class="slider__steps">
        ${ stepsTemplate }
      </div>
    </div>
  `;
}
