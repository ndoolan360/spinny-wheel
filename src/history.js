export const HISTORY_LIMIT = 30;
export const HISTORY_LABELS = {
  spin: '🌀',
  remove: '🗑️',
  'spin-remove': '🌀🗑️',
};

const historyListElement = document.getElementById('history-list');
if (!historyListElement) throw new Error('History list element not found');

const historyClearButton = document.getElementById('history-clear');
if (!historyClearButton) throw new Error('History clear button not found');

const formatHistoryText = ({ label, value, timestamp }) => {
  const time = timestamp ? `(${timestamp}) ` : '';
  return `${time}${label}: ${value}`;
};

const normalizeEntry = ({ type, label, value, timestamp = '' }) => ({
  type,
  label: HISTORY_LABELS[type] ?? label ?? type ?? 'Event',
  value,
  timestamp,
});

const applyEntryToItem = (item, entry) => {
  item.textContent = formatHistoryText(entry);
  item.dataset.type = entry.type ?? '';
  item.dataset.label = entry.label ?? '';
  item.dataset.value = entry.value ?? '';
  item.dataset.timestamp = entry.timestamp ?? '';
};

const createHistoryItem = (entry) => {
  const item = document.createElement('li');
  item.classList.add('history-item--new');
  applyEntryToItem(item, entry);
  // set a timer to remove the "new" class
  setTimeout(() => item.classList.remove('history-item--new'), 600);
  return item;
};

const tryCompact = (nextEntry) => {
  const latestItem = historyListElement.firstElementChild;
  if (!latestItem) return false;

  const prevEntry = {
    type: latestItem.dataset.type,
    label: latestItem.dataset.label,
    value: latestItem.dataset.value,
    timestamp: latestItem.dataset.timestamp,
  };

  const shouldCompact =
    prevEntry.type === 'spin' &&
    nextEntry.type === 'remove' &&
    prevEntry.value === nextEntry.value;

  if (!shouldCompact) return false;

  const compacted = normalizeEntry({
    type: 'spin-remove',
    value: nextEntry.value,
    timestamp: nextEntry.timestamp || prevEntry.timestamp,
  });

  applyEntryToItem(latestItem, compacted);
  return true;
};

export const recordHistory = ({ type, label, value, timestamp = '' }) => {
  if (!value) return;

  const entry = normalizeEntry({ type, label, value, timestamp });

  if (tryCompact(entry)) return;

  const item = createHistoryItem(entry);
  historyListElement.prepend(item);

  while (historyListElement.children.length > HISTORY_LIMIT) {
    historyListElement.removeChild(historyListElement.lastElementChild);
  }
};

export const clearHistory = () => {
  historyListElement.replaceChildren();
};

historyClearButton.addEventListener('click', clearHistory);
