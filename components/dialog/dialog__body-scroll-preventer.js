import scrollbarWidth from 'scrollbar-width';

import styles from './dialog.css';

let isPrevented = false;
let previousDocumentWidth = null;

export default {
  prevent() {
    if (isPrevented) {
      return;
    }
    isPrevented = true;
    const documentHasScroll = document.documentElement.scrollHeight > window.innerHeight ||
      getComputedStyle(document.documentElement).overflowY === 'scroll';
    document.documentElement.classList.add(styles.documentWithoutScroll);

    const scrollWidth = scrollbarWidth();

    if (documentHasScroll && scrollWidth > 0) {
      previousDocumentWidth = document.documentElement.style.width;
      document.documentElement.style.width = `calc(100% - ${scrollWidth}px)`;
    }
  },

  reset() {
    if (!isPrevented) {
      return;
    }
    isPrevented = false;

    document.documentElement.classList.remove(styles.documentWithoutScroll);

    if (previousDocumentWidth !== null) {
      document.documentElement.style.width = previousDocumentWidth;
      previousDocumentWidth = null;
    }
  }
};
