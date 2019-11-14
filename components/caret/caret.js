import {getRect} from '../global/dom';

/**
 * @name Caret
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
    let curNode = this.target && this.target.childNodes[0];
    if (position !== undefined) {
      let curPos = 0;
      let i = -1;
      const nodeTypeText = 3;
      if (curNode && curNode.nodeType !== undefined) {
        while (curPos < position && curNode.nodeType !== nodeTypeText) {
          i++;
          if (curNode.childNodes[i] !== null) {
            curPos += curNode.childNodes[i].textContent.length;
            if (curPos >= position) {
              curNode = curNode.childNodes[i];
              curPos -= curNode.textContent.length;
              i = -1;
            }
          }
        }
      }
      correctedPosition = position - curPos;
    }

    if (isContentEditable) {
      this.focus();

      try {
        window.getSelection().collapse(curNode || this.target, correctedPosition);
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
