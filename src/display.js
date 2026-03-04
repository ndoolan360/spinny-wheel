import { getOptionCount, getOptionText } from './options.js';
import { getTransitionTotalMs, getCurrentIndex } from './wheel.js';
import { recordHistory } from './history.js';

/** @type {HTMLDivElement} */
const wheelElement = document.getElementById('wheel');
if (!wheelElement) throw new Error('Wheel element not found');

/** @type {HTMLOutputElement} */
const displayElement = document.getElementById('display');
if (!displayElement) throw new Error('Display element not found');

export const updateDisplay = () => {
  if (getOptionCount() === 0) {
    displayElement.textContent = '';
    return;
  }

  const selectedIndex = getCurrentIndex();
  displayElement.textContent = getOptionText(selectedIndex);
};

/**
 * Records the result of a wheel spin to history
 * @param {TransitionEvent} event
 */
export const recordWheelResult = (event) => {
  if (event.target !== wheelElement) return;
  if (event.propertyName !== 'transform') return;

  const count = getOptionCount();
  if (count === 0) return;

  const selectedIndex = getCurrentIndex();
  const value = getOptionText(selectedIndex);

  recordHistory({ type: 'spin', value });
}

let rafId = 0;
let stopAt = 0;

const startTracking = () => {
  const totalMs = getTransitionTotalMs();
  stopAt = performance.now() + totalMs;

  if (rafId) cancelAnimationFrame(rafId);

  const tick = () => {
    updateDisplay();

    if (performance.now() < stopAt) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = 0;
    }
  };

  tick();
};

const wheelObserver = new MutationObserver(() => {
  startTracking();
});

wheelObserver.observe(wheelElement, {
  attributes: true,
  attributeFilter: ['style'],
});

wheelElement.addEventListener('transitionend', recordWheelResult);
