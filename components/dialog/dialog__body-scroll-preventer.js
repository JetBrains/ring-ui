import scrollbarWidth from 'scrollbar-width';

import styles from './dialog.css';

const isPrevented = new Set();
let previousDocumentWidth = null;

const prevent = key => {
  if (isPrevented.has(key)) {
    return;
  }

  isPrevented.add(key);

  if (isPrevented.size > 1) {
    return;
  }

  const documentHasScroll = document.documentElement.scrollHeight > window.innerHeight ||
    getComputedStyle(document.documentElement).overflowY === 'scroll';
  document.documentElement.classList.add(styles.documentWithoutScroll);

  const scrollWidth = scrollbarWidth();

  if (documentHasScroll && scrollWidth > 0) {
    previousDocumentWidth = document.documentElement.style.width;
    document.documentElement.style.width = `calc(100% - ${scrollWidth}px)`;
  }
};

const reset = key => {
  if (isPrevented.size === 0) {
    return;
  }

  isPrevented.delete(key);

  if (isPrevented.size > 0) {
    return;
  }

  document.documentElement.classList.remove(styles.documentWithoutScroll);

  if (previousDocumentWidth !== null) {
    document.documentElement.style.width = previousDocumentWidth;
    previousDocumentWidth = null;
  }
};

const preventerFactory = key => {
  const preventerKey = key || Math.random();

  return {
    prevent: () => prevent(preventerKey),
    reset: () => reset(preventerKey)
  };
};

export default preventerFactory;
