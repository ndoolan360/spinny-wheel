import { setWheelSegments } from './wheel.js';
import { updateDisplay } from './display.js';
import { setOptions } from './options.js';
import { saveStorage } from './storage.js';
import { setActionButtonState } from './buttons.js';

/** @type {HTMLTextAreaElement} */
const itemInputElement = document.getElementById('items-input')
if (!itemInputElement) throw new Error('Item entry element not found');

/**
 * @param {function(InputEvent): void} handler
 * @returns {void}
 */
export const registerInputHandler = (handler) => {
  itemInputElement.disabled = false;
  itemInputElement.addEventListener("input", handler);
}

/**
 * @returns {void}
 */
export const handleInput = () => {
  const textContent = itemInputElement.value;
  if (typeof textContent !== 'string') throw new Error('Text value not string')
  saveStorage(textContent);

  const options = textContent
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  setOptions(options);
  setWheelSegments(options.length);
  updateDisplay();
  setActionButtonState(options.length);
};

/**
 * @returns {void}
 */
export const clearInput = () => {
  itemInputElement.value = '';
};


/**
 * @param {string[]} options
 * @returns {void}
 */
export const setInput = (options) => {
  itemInputElement.value = options.join('\n');
};

/**
 * @param {string} text
 */
export const setInputRaw = (text) => {
  itemInputElement.value = text;
}
