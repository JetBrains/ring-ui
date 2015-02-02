/**
 * Caret utils. Ported from jquery-caret
 * @see https://github.com/princed/caret
 */
var Caret = {};

/**
 * Set focus on target if possible
 * @param target {HTMLElement}
 */
function focus(target) {
  if (!document.activeElement || document.activeElement !== target) {
    target.focus();
  }
}

/**
 * Detect contentEditable
 * @param target {HTMLElement}
 * @return {boolean}
 */
function isContentEditable(target) {
  return target.contentEditable === 'true';
}

/**
 * Line endings RegExp
 * @type {RegExp}
 */
var returnRE = /\r/g;
/**
 * String line endings normalizer
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
 * @param target {HTMLElement}
 * @return {number}
 */
Caret.get = function getCaret(target) {
  if (!window.getSelection) {
    return 0;
  }

  if (isContentEditable(target)) {
    focus(target);

    var selection = window.getSelection();

    // Opera 12 check
    if (!selection.rangeCount) {
      return 0;
    }

    var range1 = selection.getRangeAt(0);
    var range2 = range1.cloneRange();

    range2.selectNodeContents(target);
    range2.setEnd(range1.endContainer, range1.endOffset);

    return range2.toString().length;
  }

  return target.selectionStart;
};

/**
 * Set caret position in symbols
 * @param target {HTMLElement}
 * @param position {number}
 * @return {number}
 */
Caret.set = function setCaret(target, position) {
  var targetIsContentEditable = isContentEditable(target);

  if (position === -1) {
    var value = targetIsContentEditable ? target.textContent : normalizeNewlines(target.value);
    position = value.length;
  }

  if (!window.getSelection) {
    return -1;
  }

  if (targetIsContentEditable) {
    focus(target);

    try {
      window.getSelection().collapse(target.firstChild, position);
    } catch (e) {
    }

  } else {
    target.setSelectionRange(position, position);
    focus(target);
  }

  return position;
};

/**
 * Get caret position in pixels
 * @param target {HTMLElement}
 * @return {number}
 */
Caret.getOffset = function getOffset(target) {
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
    var targetRect = target.getBoundingClientRect();
    var caretRect = range.getBoundingClientRect();

    offset = caretRect.right - targetRect.left - range.startContainer.offsetLeft;
  }

  return offset;
};

module.exports = Caret;
