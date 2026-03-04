import { updateDisplay } from "./display.js";
import { setInput } from "./input.js";
import { getCurrentIndex, setWheelSegments } from "./wheel.js";
import { saveStorage } from "./storage.js";
import { recordHistory } from "./history.js";
import { setActionButtonState } from "./buttons.js";

/** @type {HTMLUListElement} */
const optionsElement = document.getElementById('options');
if (!optionsElement) throw new Error('Options element not found');

/**
 * @returns {number}
 */
export const getOptionCount = () => optionsElement.children.length;

/**
 * Gets the option text for a given index
 * @param {number} index
 * @return {string}
 */
export const getOptionText = (index) => optionsElement.children[index]?.textContent ?? '';

/**
 * Updates the options in the wheel
 * @param {string[]} options
 */
export const setOptions = (options) => {
  optionsElement.replaceChildren(...options.map((option, i) => {
    const optionElement = document.createElement('li');
    optionElement.textContent = option;
    const angle = i * (360 / options.length);
    optionElement.style.setProperty('--angle', angle);
    return optionElement;
  }));
};

/**
 * Removes the currently selected option from the wheel
 * @param {boolean} rrveInput - Whether to preserve the text in the input field (default: true)
 * @returns {void}
 */
export const removeCurrentOption = (preserveInput = true) => {
  const currentIndex = getCurrentIndex();
  if (currentIndex === -1) return;

  const options = Array.from(optionsElement.children).map((child) => child.textContent ?? '');
  const removed = options.splice(currentIndex, 1);

  if (removed.length === 0) return;
  recordHistory({ type: 'remove', value: removed[0] });

  if (!preserveInput) {
    setInput(options);
    saveStorage(options.join('\n'));
  }


  setOptions(options);
  setWheelSegments(options.length);
  updateDisplay();
  setActionButtonState(options.length);
};
