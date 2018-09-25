import {getRect} from '../global/dom';

/**
 * @name Caret
 * @category Utilities
 * @tags Ring UI Language
 * @description Allows manipulation of the caret position in a text box or a contenteditable element. Ported from [jquery-caret](https://github.com/accursoft/caret/).
 * @see https://github.com/princed/caret
 * @example
   <example name="Caret">
    <file name="index.html">
      <textarea id="test-input" class="ring-input">
      Lorem ipsum
      dolor sit amet
      </textarea>
      <div>
        <a href="" id="cursor-action" class="ring-link">Set caret position</a>
      </div>
    </file>
    <file name="index.js">
      import '@jetbrains/ring-ui/components/input/input.scss';
      import '@jetbrains/ring-ui/components/link/link__legacy.css';
      import Caret from '@jetbrains/ring-ui/components/caret/caret';

      const targetEl = document.getElementById('test-input');
      const caret = new Caret(targetEl);

      document.getElementById('cursor-action').addEventListener('click', event => {
        caret.focus();
        caret.setPosition(4);
        event.preventDefault();
      })
    </file>
   </example>
 */

export default class Caret {
  /**
   * Line endings RegExp
   * @type {RegExp}
   */
  static returnRE = /\r/g;

  /**
   * Line endings normalizer
   * Borrowed from jQuery
   * @see https://github.com/jquery/jquery/blob/master/src/attributes/val.js
   * @param value {*}
   * @return {*}
   */
  static normalizeNewlines(value) {
    return typeof value === 'string' ? value.replace(this.returnRE, '') : value;
  }

  constructor(target) {
    this.target = target;
  }

  isContentEditable() {
    return this.target.contentEditable === 'true';
  }

  /**
   * Set focus on target if possible
   */
  focus() {
    if (!document.activeElement || document.activeElement !== this.target) {
      this.target.focus();
    }
  }

  /**
   * Get caret position index
   * @param {Object} [params]
   * @param {boolean} params.avoidFocus
   * @return {number}
   */
  getPosition(params = {}) {
    if (this.isContentEditable()) {
      if (!params.avoidFocus) {
        this.focus();
      }

      const selection = window.getSelection();

      if (!selection.rangeCount) {
        return 0;
      }

      const range1 = selection.getRangeAt(0);

      if (range1.startOffset !== range1.endOffset) {
        return -1;
      }

      const range2 = range1.cloneRange();

      range2.selectNodeContents(this.target);
      range2.setEnd(range1.endContainer, range1.endOffset);

      return range2.toString().length;
    }

    if (this.target.selectionStart !== this.target.selectionEnd) {
      return -1;
    }

    return this.target.selectionStart;
  }

  /**
   * Set caret position index
   * @param  {number} position
   * @return {number}
   */
  setPosition(position) {
    const isContentEditable = this.isContentEditable();
    let correctedPosition;

    if (position === -1) {
      const value = isContentEditable
        ? this.target.textContent
        : this.constructor.normalizeNewlines(this.target.value);
      correctedPosition = value.length;
    } else {
      correctedPosition = position;
    }

    if (isContentEditable) {
      this.focus();

      try {
        window.getSelection().collapse(this.target.firstChild || this.target, correctedPosition);
      } catch (e) {
        // Do nothing
      }

    } else {
      this.target.setSelectionRange(correctedPosition, correctedPosition);
    }

    return correctedPosition;
  }

  /**
   * Get caret position in pixels
   * @return {number}
   */
  getOffset() {
    let offset = 0;
    let range;

    try {
      // Both statements may throw
      range = window.getSelection().getRangeAt(0).cloneRange();
      range.setStart(range.startContainer, range.startOffset - 1);
    } catch (e) {
      return offset;
    }

    if (range && range.endOffset !== 0 && range.toString() !== '') {
      offset =
        getRect(range).right -
        getRect(this.target).left -
        (range.startContainer.offsetLeft || 0);
    }

    return offset;
  }
}
