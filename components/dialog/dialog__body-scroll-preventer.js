import scrollbarWidth from 'scrollbar-width';

import {bodyWithoutScroll} from './dialog.css';

let isPrevented = false;

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
      this.previousBodyWidth = document.body.style.width;
      document.body.style.width = `calc(100% - ${scrollWidth}px)`;
    }
  },

  reset() {
    if (!isPrevented) {
      return;
    }
    isPrevented = false;

    document.body.classList.remove(bodyWithoutScroll);

    if (this.previousBodyWidth !== null) {
      document.body.style.width = this.previousBodyWidth;
      this.previousBodyWidth = null;
    }
  }
};
