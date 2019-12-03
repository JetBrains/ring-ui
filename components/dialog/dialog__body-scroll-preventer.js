import scrollbarWidth from 'scrollbar-width';

import {bodyWithoutScroll} from './dialog.css';

let isPrevented = false;
let previousBodyWidth = null;

export default {
  prevent() {
    if (isPrevented) {
      return;
    }
    isPrevented = true;
    document.documentElement.classList.add(bodyWithoutScroll);

    const scrollWidth = scrollbarWidth();

    const bodyHasScroll = document.documentElement.scrollHeight > window.innerHeight;

    if (bodyHasScroll && scrollWidth > 0) {
      previousBodyWidth = document.documentElement.style.width;
      document.documentElement.style.width = `calc(100% - ${scrollWidth}px)`;
    }
  },

  reset() {
    if (!isPrevented) {
      return;
    }
    isPrevented = false;

    document.documentElement.classList.remove(bodyWithoutScroll);

    if (previousBodyWidth !== null) {
      document.documentElement.style.width = previousBodyWidth;
      previousBodyWidth = null;
    }
  }
};
