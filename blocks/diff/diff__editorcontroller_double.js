/**
 * @fileoverview Controller for double-pane editor.
 * @author igor.alexeenko (Igor Alexeenko)
 */

define(['diff/diff__tools', 'codemirror', 'handlebars',
  'diff/diff__editorcontroller',
  'diff/diff__parser_doublepane'], function(diffTool, CodeMirror, Handlebars) {

  /**
   * @param {Element} element
   * @constructor
   * @extends {diffTool.EditorController}
   */
  diffTool.DoubleEditorController = function(element) {
    diffTool.DoubleEditorController.super_.constructor.call(this, element,
        true, diffTool.ParserDoublePane.getInstance());
  };
  diffTool.inherit(diffTool.DoubleEditorController, diffTool.EditorController);

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
  // them any way I want.
  /**
   * CSS-like selectors of editor DOM-elements.
   * @enum {string}
   */
  diffTool.DoubleEditorController.CssSelector = {
    BASE: '.diff_doublepane',
    ORIGINAL: '.diff__original',
    MODIFIED: '.diff__modified'
  };

  /**
   * @static
   * @return {Object}
   */
  diffTool.DoubleEditorController.getEditorOptions = function() {
    return {
      lineNumbers: true,
      matchBrackets: true,
      mode: 'text/x-java',
      readOnly: true,
      viewportMargin: 0
    };
  };

  /**
   * Returns size of content of {@link CodeMirror}.
   * @param {CodeMirror} editor
   * @return {number}
   */
  diffTool.DoubleEditorController.getEditorContentWidth = function(editor) {
    return editor.getScrollerElement().scrollWidth -
        editor.getGutterElement().clientWidth;
  };

  /**
   * Counts maximal value, which can be set to instance of {@link CodeMirror}
   * without corrupting its scroll. Used to synchronize horizontal scroll.
   * @param {CodeMirror} editor
   * @return {number}
   * @private
   */
  diffTool.DoubleEditorController.getMaxScroll_ = function(editor) {
    return diffTool.DoubleEditorController.getEditorContentWidth(editor)  -
        editor.getWrapperElement().offsetWidth;
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
    } else {
      this.unbindEditors_();

      this.codeMirrorOriginal_ = null;
      this.codeMirrorModified_ = null;

      this.originalLines_ = null;
      this.modifiedLines_ = null;

      this.originalOffsets_ = null;
      this.modifiedOffsets_ = null;

      this.element_.innerHTML = '';
    }
  };

  /**
   * @override
   */
  diffTool.DoubleEditorController.prototype.setContentInternal = function(
      original, modified, diff) {
    this.unbindEditors_();

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
    CodeMirror.on(this.codeMirrorOriginal_, 'scroll',
        diffTool.bindContext(this.onScroll_, this));
    CodeMirror.on(this.codeMirrorModified_, 'scroll',
        diffTool.bindContext(this.onScroll_, this));

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
    CodeMirror.off(this.codeMirrorOriginal_, 'scroll');
    CodeMirror.off(this.codeMirrorModified_, 'scroll');
  };

  /**
   * @param {CodeMirror} target
   * @private
   */
  diffTool.DoubleEditorController.prototype.onScroll_ = function(target) {
    var oppositeElement;
    var elementOffsets;
    var oppositeElementOffsets;

    if (target === this.codeMirrorOriginal_) {
      oppositeElement = this.codeMirrorModified_;
      elementOffsets = this.originalOffsets_;
      oppositeElementOffsets = this.modifiedOffsets_;
    } else {
      oppositeElement = this.codeMirrorOriginal_;
      elementOffsets = this.modifiedOffsets_;
      oppositeElementOffsets = this.originalOffsets_;
    }

    var scrollPosition = target.getScrollInfo();
    var equator = Math.round(scrollPosition.clientHeight / 2);

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

    var isOriginalEditor = (target === this.codeMirrorOriginal_);

    var editorMaxWidth = isOriginalEditor ? this.originalEditorMaxWidth_ :
        this.modifiedEditorMaxWidth_;
    var oppositeMaxWidth = isOriginalEditor ? this.modifiedEditorMaxWidth_ :
        this.originalEditorMaxWidth_;

    var scrollRatio = scrollPosition.left / editorMaxWidth;
    var oppositeScrollLeft = Math.round(oppositeMaxWidth * scrollRatio);

    oppositeElement.scrollTo(oppositeScrollLeft, oppositeScrollTop);
  };

  /**
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
   * Returns number of used offset.
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

    return -1;
  };
});
