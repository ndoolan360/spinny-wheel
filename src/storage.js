const STORAGE_KEY = 'spinny-wheel.items';

export const loadStorage = () => {
  if (typeof sessionStorage === 'undefined') return '';
  return sessionStorage.getItem(STORAGE_KEY) ?? '';
};

export const saveStorage = (text) => {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(STORAGE_KEY, text);
};
