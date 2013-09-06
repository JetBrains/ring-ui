/**
 * @fileoverview Controller for double-pane editor.
 * @author igor.alexeenko (Igor Alexeenko)
 */

define([
  'diff/diff__tools',
  'codemirror',
  'handlebars',
  'raphael',
  'diff/diff__editorcontroller',
  'diff/diff__parser_doublepane'
], function(diffTool, CodeMirror, Handlebars, raphael) {

  /**
   * @param {Element} element
   * @constructor
   * @extends {diffTool.EditorController}
   */
  diffTool.DoubleEditorController = function(element) {
    diffTool.DoubleEditorController.super_.constructor.call(this, element,
        true, diffTool.ParserDoublePane.getInstance());

    raphael();

    /**
     * Visualization of equator line.
     * @type {Element}
     * @private
     */
    this.line_ = document.createElement('div');

    this.line_.style.borderTop = 'solid 1px red';
    this.line_.style.boxShadow = '0 4px 4px rgba(128, 0, 0, 0.3)';
    this.line_.style.left = '50%';
    this.line_.style.marginLeft = '-40px';
    this.line_.style.position = 'absolute';
    this.line_.style.width = '80px';
  };
  diffTool.inherit(diffTool.DoubleEditorController, diffTool.EditorController);

  /**
   * Equator ratio is a ratio of height of editor on which speed of scrolling
   * of chunks of corresponding code in opposite editor changes.
   * @type {number}
   * @const
   */
  diffTool.DoubleEditorController.EQUATOR_RATIO = 0.5;

  /**
   * IDs of templates for {@link Handlebars}.
   * @enum {string}
   */
  diffTool.DoubleEditorController.Template = {
    BASE: 'diff_doublepane'
  };

  // todo(igor.alexeenko): I don't like the idea of saving selectors
  // in a format, which is used only by {@link querySelector} or
  // {@link jQuery}. It should be just a plain strings, so I can use
  // them any way I want, for example in a {@code getElementsByClassName}
  // method.
  /**
   * CSS-like selectors of editor DOM-elements.
   * @enum {string}
   */
  diffTool.DoubleEditorController.CssSelector = {
    /**
     * Wrap element.
     */
    BASE: '.diff_doublepane',

    /**
     * Element, which contains editor with original code.
     */
    ORIGINAL: '.diff__original',

    /**
     * Element, which contains editor with modified code.
     */
    MODIFIED: '.diff__modified'
  };

  /**
   * Returns object which represents options for current instance of editor.
   * @static
   * @param {boolean} opt_isOriginal
   * @return {Object}
   */
  diffTool.DoubleEditorController.getEditorOptions = function(opt_isOriginal) {
    if (!diffTool.isDef(opt_isOriginal)) {
      opt_isOriginal = false;
    }

    return {
      lineNumbers: true,
      matchBrackets: true,
      mode: {
        name: 'text/x-java'
      },
      readOnly: true,
      viewportMargin: 0
    };
  };

  /**
   * Counts maximal value, which can be set to instance of {@link CodeMirror}
   * without corrupting its scroll. Used to synchronize horizontal scroll.
   * @static
   * @param {CodeMirror} editor
   * @return {number}
   * @private
   */
  diffTool.DoubleEditorController.getMaxScroll_ = function(editor) {
    var scrollInfo = editor.getScrollInfo();
    return scrollInfo.width - scrollInfo.clientWidth;
  };

  /**
   * @override
   */
  diffTool.DoubleEditorController.prototype.setEnabledInternal = function(
      enabled) {
    if (enabled) {
      this.element_.innerHTML = Handlebars.partials[
          diffTool.DoubleEditorController.Template.BASE]();

      this.originalElement_ = this.element_.querySelector(
          diffTool.DoubleEditorController.CssSelector.ORIGINAL);
      this.modifiedElement_ = this.element_.querySelector(
          diffTool.DoubleEditorController.CssSelector.MODIFIED);

      this.codeMirrorOriginal_ = new CodeMirror(this.originalElement_,
          diffTool.DoubleEditorController.getEditorOptions());
      this.codeMirrorModified_ = new CodeMirror(this.modifiedElement_,
          diffTool.DoubleEditorController.getEditorOptions());

      this.element_.appendChild(this.line_);
    } else {
      this.line_.parentNode.removeChild(this.line_);

      this.element_.innerHTML = '';

      this.codeMirrorOriginal_ = null;
      this.codeMirrorModified_ = null;
      this.originalLines_ = null;
      this.modifiedLines_ = null;
      this.originalOffsets_ = null;
      this.modifiedOffsets_ = null;
      this.scrollHandler_ = null;
    }
  };

  /**
   * @override
   */
  diffTool.DoubleEditorController.prototype.setContentInternal = function(
      original, modified, diff) {
    this.codeMirrorOriginal_.setValue(original);
    this.codeMirrorModified_.setValue(modified);

    this.bindEditors_(original, modified, diff);
  };

  /**
   * Add unified scroll for both editors and draw a connectors between
   * them.
   * @param {string} original
   * @param {string} modified
   * @param {diffTool.Parser.Diff} diff
   * @private
   */
  diffTool.DoubleEditorController.prototype.bindEditors_ = function(
      original, modified, diff) {
    this.setEditorEnabled_(this.codeMirrorOriginal_, true);
    this.setEditorEnabled_(this.codeMirrorModified_, true);

    /**
     * @type {number}
     * @private
     */
    this.originalEditorMaxWidth_ = diffTool.DoubleEditorController.
        getMaxScroll_(this.codeMirrorOriginal_);

    /**
     * @type {number}
     * @private
     */
    this.modifiedEditorMaxWidth_ = diffTool.DoubleEditorController.
        getMaxScroll_(this.codeMirrorModified_);

    this.originalLines_ = this.codeParser_.getLines(original, diff,
        diffTool.ParserDoublePane.CodeType.ORIGINAL);
    this.modifiedLines_ = this.codeParser_.getLines(modified, diff,
        diffTool.ParserDoublePane.CodeType.MODIFIED);

    this.originalOffsets_ = this.getLinesOffset_(this.originalLines_,
        this.codeMirrorOriginal_);
    this.modifiedOffsets_ = this.getLinesOffset_(this.modifiedLines_,
        this.codeMirrorModified_);
  };

  /**
   * Remove scroll handlers and destroy connectors.
   * @private
   */
  diffTool.DoubleEditorController.prototype.unbindEditors_ = function() {
    this.setEditorEnabled_(this.codeMirrorOriginal_, false);
    this.setEditorEnabled_(this.codeMirrorModified_, false);
  };

  /**
   * Approximate time, which needed to correctly scroll opposite editor.
   * @type {number}
   * @const
   */
  diffTool.DoubleEditorController.SCROLL_TIMEOUT = 200;

  /**
   * Disables opposite editor to prevent feedback loops from scroll event
   * @param {CodeMirror} target
   * @private
   */
  diffTool.DoubleEditorController.prototype.onScroll_ = function(target) {
    var oppositeEditor = (target === this.codeMirrorOriginal_) ?
        this.codeMirrorModified_ :
        this.codeMirrorOriginal_;

    if (this.disabledEditor_ && oppositeEditor !== this.disabledEditor_) {
      return;
    }

    clearTimeout(this.disableEditorTimeout_);

    if (!this.disabledEditor_ || oppositeEditor !== this.disabledEditor_) {
      this.setEditorEnabled_(oppositeEditor, false);

      /**
       * Link to currently disabled editor.
       * @type {CodeMirror}
       * @private
       */
      this.disabledEditor_ = oppositeEditor;
    }

    this.syncScroll_(target);

    this.disableEditorTimeout_ = setTimeout(diffTool.bindContext(function() {
      this.setEditorEnabled_(this.disabledEditor_, true);
      this.disabledEditor_ = null;
    }, this), diffTool.DoubleEditorController.SCROLL_TIMEOUT);
  };

  /**
   * @param {CodeMirror} editor
   * @private
   */
  diffTool.DoubleEditorController.prototype.syncScroll_ = function(editor) {
    var oppositeElement;
    var elementOffsets;
    var oppositeElementOffsets;

    var isOriginalEditor = (editor === this.codeMirrorOriginal_);

    if (isOriginalEditor) {
      oppositeElement = this.codeMirrorModified_;
      elementOffsets = this.originalOffsets_;
      oppositeElementOffsets = this.modifiedOffsets_;
    } else {
      oppositeElement = this.codeMirrorOriginal_;
      elementOffsets = this.modifiedOffsets_;
      oppositeElementOffsets = this.originalOffsets_;
    }

    var scrollPosition = editor.getScrollInfo();
    // todo(igor.alexeenko): Update equator discretely, only when active chunk
    // changes.
    var equator = this.getEquator_(editor);

    var currentOffsetIndex = this.getCurrentOffset_(
        scrollPosition.top + equator,
        elementOffsets);

    var currentOffset = elementOffsets[currentOffsetIndex];

    var offsetHeight = currentOffset.bottom - currentOffset.top;
    var scrollTop = scrollPosition.top - currentOffset.top + equator;

    var ratio = scrollTop / offsetHeight;

    var oppositeOffset = oppositeElementOffsets[currentOffsetIndex];
    var oppositeOffsetHeight = oppositeOffset.bottom - oppositeOffset.top;

    var oppositeScroll = Math.round(oppositeOffsetHeight * ratio);
    var oppositeScrollTop = oppositeScroll + oppositeOffset.top - equator;

    var editorMaxWidth = isOriginalEditor ? this.originalEditorMaxWidth_ :
        this.modifiedEditorMaxWidth_;
    var oppositeMaxWidth = isOriginalEditor ? this.modifiedEditorMaxWidth_ :
        this.originalEditorMaxWidth_;

    var scrollRatio = scrollPosition.left / editorMaxWidth;
    var oppositeScrollLeft = Math.round(oppositeMaxWidth * scrollRatio);

    oppositeElement.scrollTo(oppositeScrollLeft, oppositeScrollTop);
  };

  /**
   * Equator is a line, on which speed of scrolling of chunk of code in opposite
   * editor corrects to synchronize scrolling and make two editors show
   * corresponding parts of code. Basically this line is the middle of the
   * editor, but in case, when there are a few code below this line goes down
   * to finish scrolling of both editors at the same moment.
   * @param {CodeMirror} editor
   * @return {number}
   * @private
   */
  diffTool.DoubleEditorController.prototype.getEquator_ = function(editor) {
    var editorScrollInfo = editor.getScrollInfo();
    var equator;

    if (this.isLastScreen_(editor)) {
      equator = editorScrollInfo.clientHeight - (editorScrollInfo.height -
          editorScrollInfo.top - editorScrollInfo.clientHeight);
    } else {
      equator = Math.round(editorScrollInfo.clientHeight *
          diffTool.DoubleEditorController.EQUATOR_RATIO);
    }

    this.line_.style.top = equator + 'px';

    return equator;
  };

  /**
   * Returns true if below height of code below the bottom line of editor
   * is lower than offset to equator, which means that code below may not
   * ever reach equator.
   * @return {boolean}
   * @private
   */
  diffTool.DoubleEditorController.prototype.isLastScreen_ = function(editor) {
    var scrollInfo = editor.getScrollInfo();

    return (scrollInfo.height - scrollInfo.top <=
        scrollInfo.clientHeight + (scrollInfo.clientHeight -
            scrollInfo.clientHeight *
                diffTool.DoubleEditorController.EQUATOR_RATIO));
  };

  /**
   * @param {CodeMirror} editor
   * @param {boolean} enabled
   * @private
   */
  diffTool.DoubleEditorController.prototype.setEditorEnabled_ = function(
      editor, enabled) {
    if (enabled) {
      if (!this.scrollHandler_) {
        /**
         * Scroll handler which calls method
         * of {@code diffTool.DoubleEditorController} with bind context.
         * @type {Function}
         * @private
         */
        this.scrollHandler_ = diffTool.bindContext(this.onScroll_, this);
      }

      CodeMirror.on(editor, 'scroll', this.scrollHandler_);
    } else {
      CodeMirror.off(editor, 'scroll', this.scrollHandler_);
    }
  };

  /**
   * Returns {@code Array} of objects, which represents offsets of chunks
   * of code.
   * @param {Array.<Object>} lines
   * @param {CodeMirror} editor
   * @return {Array.<Object>}
   * @private
   */
  diffTool.DoubleEditorController.prototype.getLinesOffset_ = function(lines,
      editor) {
    var offsets = [];

    lines.forEach(function(line) {
      offsets.push({
        bottom: editor.heightAtLine(line.bottom, 'local'),
        type: line.codeType,
        top: editor.heightAtLine(line.top, 'local')
      });
    }, this);

    return offsets;
  };

  /**
   * Returns index of object which represents pixel offsets of current
   * chunk of code.
   * @param {number} scrollPosition
   * @param {Array.<Object>} offsets
   * @return {number}
   * @private
   */
  diffTool.DoubleEditorController.prototype.getCurrentOffset_ = function(
      scrollPosition, offsets) {
    var offset;

    for (var i = 0, l = offsets.length; offset = offsets[i], i < l; i++) {
      if (offset.top <= scrollPosition && offset.bottom >= scrollPosition) {
        return i;
      }
    }

    return l - 1;
  };

  return diffTool.DoubleEditorController;
});
