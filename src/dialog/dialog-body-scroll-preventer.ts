import scrollbarWidth from 'scrollbar-width';

import styles from './dialog.css';

const isPrevented = new Set();
let previousDocumentWidth: string | null = null;

const prevent = (key: string | number) => {
  if (isPrevented.has(key)) {
    return;
  }

  isPrevented.add(key);

  if (isPrevented.size > 1) {
    return;
  }

  const documentHasScroll =
    document.documentElement.scrollHeight > window.innerHeight ||
    getComputedStyle(document.documentElement).overflowY === 'scroll';
  document.documentElement.classList.add(styles.documentWithoutScroll);

  const scrollWidth = scrollbarWidth();
  const {scrollbarGutter} = getComputedStyle(document.documentElement);
  const documentHasScrollbarGutter = scrollbarGutter === 'stable' || scrollbarGutter === 'both-edges';

  if (
    documentHasScroll &&
    scrollWidth !== null &&
    scrollWidth !== undefined &&
    scrollWidth > 0 &&
    !documentHasScrollbarGutter
  ) {
    previousDocumentWidth = document.documentElement.style.width;
    document.documentElement.style.width = `calc(100% - ${scrollWidth}px)`;
  }
};

const reset = (key: string | number) => {
  if (isPrevented.size === 0) {
    return;
  }

  isPrevented.delete(key);

  if (isPrevented.size > 0) {
    return;
  }

  document.documentElement.classList.remove(styles.documentWithoutScroll);

  if (previousDocumentWidth !== null && previousDocumentWidth !== undefined) {
    document.documentElement.style.width = previousDocumentWidth;
    previousDocumentWidth = null;
  }
};

export const preventerFactory = (key: string | number) => {
  const preventerKey = key || Math.random();

  return {
    prevent: () => prevent(preventerKey),
    reset: () => reset(preventerKey),
  };
};

export default preventerFactory('default-preventer');
