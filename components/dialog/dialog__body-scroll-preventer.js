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
    document.body.classList.add(bodyWithoutScroll);

    const scrollWidth = scrollbarWidth();

    const bodyHasScroll = document.body.scrollHeight > window.innerHeight;

    if (bodyHasScroll && scrollWidth > 0) {
      previousBodyWidth = document.body.style.width;
      document.body.style.width = `calc(100% - ${scrollWidth}px)`;
    }
  },

  reset() {
    if (!isPrevented) {
      return;
    }
    isPrevented = false;

    document.body.classList.remove(bodyWithoutScroll);

    if (previousBodyWidth !== null) {
      document.body.style.width = previousBodyWidth;
      previousBodyWidth = null;
    }
  }
};
