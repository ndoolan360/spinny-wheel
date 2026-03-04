/** @type {HTMLButtonElement} */
const editItemsButtonElement = document.getElementById('edit-items-button')
if (!editItemsButtonElement) throw new Error('Edit items button element not found');

/** @type {HTMLButtonElement} */
const spinElement = document.getElementById('spin')
if (!spinElement) throw new Error('Spin element not found');

/** @type {HTMLButtonElement} */
const removeButtonElement = document.getElementById('remove');
if (!removeButtonElement) throw new Error('Remove button element not found');

/**
 * @param {boolean} disabled
 * @returns {void}
 */
export const setActionButtonState = (count) => {
  editItemsButtonElement.disabled = false;
  spinElement.disabled = count === 0;
  removeButtonElement.disabled = count === 0;
};

/* edit-items-button is always enabled, and is linked via popover,
   so we don't need to manage its state here */

/**
 * @param {function(MouseEvent): void} spinHandler
 * @param {function(MouseEvent): void} removeHandler
 * @returns {void}
 */
export const registerClickHandlers = (spinHandler, removeHandler) => {
  spinElement.addEventListener("click", spinHandler);
  removeButtonElement.addEventListener("click", removeHandler);
}
