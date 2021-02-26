import { c as _createClass, b as _classCallCheck, d as _defineProperty } from './_rollupPluginBabelHelpers-ab14fb00.js';
import { g as getRect } from './dom-0ae85140.js';

/**
 * @name Caret
 */

var Caret = /*#__PURE__*/function () {
  _createClass(Caret, null, [{
    key: "normalizeNewlines",

    /**
     * Line endings RegExp
     * @type {RegExp}
     */

    /**
     * Line endings normalizer
     * Borrowed from jQuery
     * @see https://github.com/jquery/jquery/blob/master/src/attributes/val.js
     * @param value {*}
     * @return {*}
     */
    value: function normalizeNewlines(value) {
      return typeof value === 'string' ? value.replace(this.returnRE, '') : value;
    }
  }]);

  function Caret(target) {
    _classCallCheck(this, Caret);

    this.target = target;
  }

  _createClass(Caret, [{
    key: "isContentEditable",
    value: function isContentEditable() {
      return this.target.contentEditable === 'true';
    }
    /**
     * Set focus on target if possible
     */

  }, {
    key: "focus",
    value: function focus() {
      if (!document.activeElement || document.activeElement !== this.target) {
        this.target.focus();
      }
    }
    /**
     * Get absolute caret position index
     * @return {number}
     */

  }, {
    key: "getAbsolutePosition",
    value: function getAbsolutePosition(node) {
      var _curNode = node;
      var curPos = 0;

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

  }, {
    key: "getPosition",
    value: function getPosition() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (this.isContentEditable()) {
        if (!params.avoidFocus) {
          this.focus();
        }

        var selection = window.getSelection();

        if (!selection.rangeCount) {
          return 0;
        }

        var range1 = selection.getRangeAt(0);
        var range2 = range1.cloneRange();
        range2.selectNodeContents(this.target);
        range2.setEnd(range1.endContainer, range1.endOffset);
        var _curNode = range1.startContainer;

        if (this.target === _curNode) {
          return range1.startOffset === 0 ? 0 : _curNode.textContent.length;
        } else if (!this.target.contains(_curNode)) {
          return -1;
        } else if (!_curNode) {
          return this.target.selectionStart;
        }

        var curPos = this.getAbsolutePosition(_curNode);

        if (range1.startContainer === range1.endContainer) {
          if (range1.startOffset === range1.endOffset) {
            return curPos + range1.startOffset;
          } else {
            return {
              startOffset: curPos + range1.startOffset,
              endOffset: curPos + range1.endOffset,
              position: range2.toString().length
            };
          }
        } else {
          var startOffset = curPos + range1.startOffset;
          var endPos = this.getAbsolutePosition(range1.endContainer);
          var endOffset = endPos + range1.endOffset;
          return {
            startOffset: startOffset,
            endOffset: endOffset,
            position: range2.toString().length
          };
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

  }, {
    key: "getRelativePosition",
    value: function getRelativePosition(curNode, position) {
      var curPos = 0;
      var _curNode = curNode;
      var nodeTypeText = 3;

      if (!_curNode) {
        return {
          _curNode: this.target,
          _correctedPosition: position
        };
      }

      if (position === 0) {
        while (_curNode.nodeType !== nodeTypeText) {
          _curNode = _curNode.childNodes[0];
        }

        var _correctedPosition2 = position;
        return {
          _curNode: _curNode,
          _correctedPosition: _correctedPosition2
        };
      }

      var i = -1;

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

      var _correctedPosition = position - curPos;

      return {
        _curNode: _curNode,
        _correctedPosition: _correctedPosition
      };
    }
    /**
     * Set caret position index
     * @param  {number} position
     * @return {number}
     */

  }, {
    key: "setPosition",
    value: function setPosition(position) {
      var isContentEditable = this.isContentEditable();
      var correctedPosition;
      var curNode = this.target && this.target.childNodes[0];

      if (position !== undefined) {
        if (position.startOffset !== undefined) {
          var range = new Range();
          var start = this.getRelativePosition(curNode, position.startOffset);
          range.setStart(start._curNode, start._correctedPosition);
          var end = this.getRelativePosition(curNode, position.endOffset);
          range.setEnd(end._curNode, end._correctedPosition);
          correctedPosition = range;
        } else if (position === -1) {
          var value = isContentEditable ? this.target.textContent : this.constructor.normalizeNewlines(this.target.value);
          correctedPosition = value.length;
        } else {
          var _this$getRelativePosi = this.getRelativePosition(curNode, position),
              _curNode = _this$getRelativePosi._curNode,
              _correctedPosition = _this$getRelativePosi._correctedPosition;

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
        } catch (e) {// Do nothing
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

  }, {
    key: "getOffset",
    value: function getOffset() {
      var offset = 0;
      var range;

      try {
        // Both statements may throw
        range = window.getSelection().getRangeAt(0).cloneRange();
        range.setStart(range.startContainer, range.startOffset - 1);
      } catch (e) {
        return offset;
      }

      if (range && range.endOffset !== 0 && range.toString() !== '') {
        offset = getRect(range).right - getRect(this.target).left - (range.startContainer.offsetLeft || 0);
      }

      return offset;
    }
  }]);

  return Caret;
}();

_defineProperty(Caret, "returnRE", /\r/g);

export default Caret;
