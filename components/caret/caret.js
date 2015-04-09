/**
 * Caret utils. Ported from jquery-caret
 * @name Caret
 * @see https://github.com/princed/caret
 */
var Caret = function (target) {
  this.target = target;
  this.isContentEditable = target.contentEditable === 'true';
};

/**
 * Set focus on target if possible
 */
Caret.prototype.focus = function focus() {
  if (!document.activeElement || document.activeElement !== this.target) {
    this.target.focus();
  }
};

/**
 * Line endings RegExp
 * @type {RegExp}
 */
var returnRE = /\r/g;
/**
 * Line endings normalizer
 * Borrowed from jQuery
 * @see https://github.com/jquery/jquery/blob/master/src/attributes/val.js
 * @param value {*}
 * @return {*}
 */
function normalizeNewlines(value) {
  return typeof value === 'string' ? value.replace(returnRE, '') : value;
}

/**
 * Get caret position in symbols
 * @param {Object} [params]
 * @param {boolean} params.avoidFocus
 * @return {number}
 */
Caret.prototype.getPosition = function getPosition(params) {
  params = params || {};

  if (!window.getSelection) {
    return 0;
  }

  if (this.isContentEditable) {
    if (!params.avoidFocus) {
      this.focus();
    }

    var selection = window.getSelection();

    // Opera 12 check
    if (!selection.rangeCount) {
      return 0;
    }

    var range1 = selection.getRangeAt(0);

    if (range1.startOffset !== range1.endOffset) {
      return -1;
    }

    var range2 = range1.cloneRange();

    range2.selectNodeContents(this.target);
    range2.setEnd(range1.endContainer, range1.endOffset);

    return range2.toString().length;
  }

  if (this.target.selectionStart !== this.target.selectionEnd) {
    return -1;
  }

  return this.target.selectionStart;
};

/**
 * Set caret position in symbols
 * @param  {number} position
 * @return {number}
 */
Caret.prototype.setPosition = function setPosition(position) {
  if (position === -1) {
    var value = this.isContentEditable ? this.target.textContent : normalizeNewlines(this.target.value);
    position = value.length;
  }

  if (!window.getSelection) {
    return -1;
  }

  if (this.isContentEditable) {
    this.focus();

    try {
      window.getSelection().collapse(this.target.firstChild || this.target, position);
    } catch (e) {
    }

  } else {
    this.target.setSelectionRange(position, position);
  }

  return position;
};

/**
 * Get caret position in pixels
 * @return {number}
 */
Caret.prototype.getOffset = function getOffset() {
  var offset = 0;
  var range;

  if (!window.getSelection) {
    return offset;
  }

  var selection = window.getSelection();

  try {
    // Both statements may throw
    range = selection.getRangeAt(0).cloneRange();
    range.setStart(range.startContainer, range.startOffset - 1);
  } catch (e) {
    return offset;
  }

  if (range && range.endOffset !== 0 && range.toString() !== '') {
    var targetRect = this.target.getBoundingClientRect();
    var caretRect = range.getBoundingClientRect();

    offset = caretRect.right - targetRect.left - (range.startContainer.offsetLeft || 0);
  }

  return offset;
};

module.exports = Caret;
