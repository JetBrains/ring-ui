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
   * Get absolute caret position index
   * @return {number}
   */
  getAbsolutePosition(node) {
    let _curNode = node;
    let curPos = 0;
    while (_curNode !== this.target) {
      while (_curNode.previousSibling) {
        curPos += _curNode.previousSibling.textContent.length;
        _curNode = _curNode.previousSibling;
      }
      _curNode = _curNode.parentNode;
    }
    return curPos;
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
      const range2 = range1.cloneRange();

      range2.selectNodeContents(this.target);
      range2.setEnd(range1.endContainer, range1.endOffset);
      const _curNode = range1.startContainer;
      if (this.target === _curNode) {
        return range1.startOffset === 0 ? 0 : _curNode.textContent.length;
      } else if (!this.target.contains(_curNode)) {
        return -1;
      } else if (!_curNode) {
        return this.target.selectionStart;
      }
      const curPos = this.getAbsolutePosition(_curNode);
      if (range1.startContainer === range1.endContainer) {
        if (range1.startOffset === range1.endOffset) {
          return curPos + range1.startOffset;
        } else {
          return {startOffset: curPos + range1.startOffset,
            endOffset: curPos + range1.endOffset,
            position: range2.toString().length};
        }
      } else {
        const startOffset = curPos + range1.startOffset;
        const endPos = this.getAbsolutePosition(range1.endContainer);
        const endOffset = endPos + range1.endOffset;
        return {startOffset, endOffset, position: range2.toString().length};
      }
    }

    return this.target.selectionStart;
  }

  /**
   * Get relative position of query
   * @param  {Node} curNode
   * @param {number} position
   * @return {{_correctedPosition: number, _curNode: Node}}
   */
  getRelativePosition(curNode, position) {
    let curPos = 0;
    let _curNode = curNode;
    const nodeTypeText = 3;
    if (!_curNode) {
      return {_curNode: this.target, _correctedPosition: position};
    }
    if (position === 0) {
      while (_curNode.nodeType !== nodeTypeText) {
        _curNode = _curNode.childNodes[0];
      }
      const _correctedPosition = position;
      return {_curNode, _correctedPosition};
    }
    let i = -1;
    if (_curNode && _curNode.nodeType !== undefined) {
      while (curPos < position && _curNode.nodeType !== nodeTypeText) {
        i++;
        if (_curNode.childNodes[i] !== null && _curNode.childNodes[i]) {
          curPos += _curNode.childNodes[i].textContent.length;
          if (curPos >= position) {
            _curNode = _curNode.childNodes[i];
            curPos -= _curNode.textContent.length;
            i = -1;
          }
        } else {
          break;
        }
      }
    }
    const _correctedPosition = position - curPos;
    return {_curNode, _correctedPosition};
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
      if (position.startOffset !== undefined) {
        const range = new Range();
        const start = this.getRelativePosition(curNode, position.startOffset);
        range.setStart(start._curNode, start._correctedPosition);
        const end = this.getRelativePosition(curNode, position.endOffset);
        range.setEnd(end._curNode, end._correctedPosition);
        correctedPosition = range;
      } else if (position === -1) {
        const value = isContentEditable
          ? this.target.textContent
          : this.constructor.normalizeNewlines(this.target.value);
        correctedPosition = value.length;
      } else {
        const {_curNode, _correctedPosition} = this.getRelativePosition(curNode, position);
        curNode = _curNode;
        correctedPosition = _correctedPosition;
      }
    }

    if (isContentEditable) {
      this.focus();

      try {
        if (correctedPosition instanceof Range) {
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(correctedPosition);
        } else {
          window.getSelection().collapse(curNode || this.target, correctedPosition);
        }
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
