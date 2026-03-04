import { registerInputHandler, handleInput, setInputRaw } from './input.js';
import { spinWheel } from './wheel.js';
import { removeCurrentOption } from './options.js';
import { loadStorage } from './storage.js';
import { setActionButtonState, registerClickHandlers } from './buttons.js';

// ========== SETUP HANDLERS ==========
registerInputHandler(handleInput);
registerClickHandlers(
  () => spinWheel(Math.random() * 360),
  () => removeCurrentOption(),
);

// ========== LOAD STORAGE ==========
const storedText = loadStorage();
if (storedText) {
  setInputRaw(storedText);
  handleInput();
} else {
  setActionButtonState(0);
}
