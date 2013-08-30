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
      readOnly: true
    };
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
//    var elementOffsets;
//    var oppositeElementOffsets;

    if (target === this.codeMirrorOriginal_) {
      oppositeElement = this.codeMirrorModified_;
//      elementOffsets = this.originalOffsets_;
//      oppositeElementOffsets = this.modifiedOffsets_;
    } else {
      oppositeElement = this.codeMirrorOriginal_;
//      elementOffsets = this.modifiedOffsets_;
//      oppositeElementOffsets = this.originalOffsets_;
    }

    var scrollPosition = target.getScrollInfo();

//    var equatorOffset = scrollPosition.clientHeight / 2;
//    var equator = scrollPosition.top + equatorOffset;

//    var currentOffsetIndex = this.getCurrentOffset_(equator, elementOffsets);
//    var currentOffset = elementOffsets[currentOffsetIndex];

//    var ratio = (equator - currentOffset.top) /
//                (currentOffset.bottom - currentOffset.top);
//
//    var currentOppositeOffset = oppositeElementOffsets[currentOffsetIndex];

//    var targetPosition = (currentOppositeOffset.top - equatorOffset) +
//        ratio * (currentOppositeOffset.bottom -
//            currentOppositeOffset.top);

    var horizontalRatio = scrollPosition.left / scrollPosition.width;
    var oppositeHorizontalOffset = Math.round(
        oppositeElement.getScrollInfo().width * horizontalRatio);

    oppositeElement.scrollTo(oppositeHorizontalOffset, scrollPosition.top);
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
        type: line.type,
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
    var currentOffset;

    offsets.forEach(function(offset, i) {
      if (!diffTool.isDef(currentOffset) &&
          offset.top <= scrollPosition &&
          offset.bottom >= scrollPosition) {
        currentOffset = i;
      }
    });

    return diffTool.isDef(currentOffset) ? currentOffset : -1;
  };
});
