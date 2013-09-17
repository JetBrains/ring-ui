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
  };
  diffTool.inherit(diffTool.DoubleEditorController, diffTool.EditorController);

  /**
   * Approximate time, which needed to correctly scroll opposite editor.
   * @type {number}
   * @const
   */
  diffTool.DoubleEditorController.SCROLL_TIMEOUT = 200;

  /**
   * Equator ratio is a ratio of height of editor on which speed of scrolling
   * of chunks of corresponding code in opposite editor changes.
   * @type {number}
   * @const
   */
  diffTool.DoubleEditorController.EQUATOR_RATIO = 0.5;

  /**
   * Ratio of width of bezier curve, on which bezier modifier places.
   * @type {number}
   * @const
   */
  diffTool.DoubleEditorController.CONNECTOR_CURVE_RATIO = 0.2;

  /**
   * ID of coloring mode for {@link CodeMirror} in which we colorize lines.
   * @type {string}
   * @const
   */
  diffTool.DoubleEditorController.EDITOR_MODE = 'background';

  /**
   * Classes, which appends to lines in {@link CodeMirror}.
   * @enum {string}
   */
  diffTool.DoubleEditorController.LineClass = {
    ADDED: 'line__added',
    BEFORE_ADDED: 'line__before_added',
    BEFORE_DELETED: 'line__before_deleted',
    DELETED: 'line__deleted',
    FIRST: 'line__first',
    LAST: 'line__last',
    MODIFIED: 'line__modified'
  };

  // todo(igor.alexeenko): Add classes for deleted and inserted chars.
  /**
   * Classes, which appends to chars to highlight inline changes.
   * @enum {string}
   */
  diffTool.DoubleEditorController.CharsClass = {
    MODIFIED: 'chars__modified'
  };

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
    MODIFIED: '.diff__modified',

    /**
     * Element between two editors on which draws connectors.
     */
    SPLITTER: '.diff__split'
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
    } else {
      this.unbindEditors_();

      this.element_.innerHTML = '';

      this.codeMirrorOriginal_ = null;
      this.codeMirrorModified_ = null;
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

    this.lines_ = this.codeParser_.parse(original, modified, diff);
    this.offsets_ = this.getLinesOffset_(this.lines_);

    this.colorizeLines_();
    this.drawConnectors_();

    if (!this.resizeHandler_) {
      this.resizeHandler_ = diffTool.bindContext(this.onResize_, this);
    }

    $(window).on('resize', this.resizeHandler_);
  };

  /**
   * Remove scroll handlers and destroy connectors.
   * @private
   */
  diffTool.DoubleEditorController.prototype.unbindEditors_ = function() {
    this.setEditorEnabled_(this.codeMirrorOriginal_, false);
    this.setEditorEnabled_(this.codeMirrorModified_, false);

    $(window).off('resize', this.resizeHandler_);
  };

  /**
   * Resizes canvas for connectors and redraws them.
   * @private
   */
  diffTool.DoubleEditorController.prototype.onResize_ = function() {
    this.drawConnectors_(true);
  };

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
    this.drawConnectors_();

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
    var isOriginalEditor = (editor === this.codeMirrorOriginal_);
    var oppositeElement = isOriginalEditor ? this.codeMirrorModified_ :
        this.codeMirrorOriginal_;

    var scrollPosition = editor.getScrollInfo();
    // todo(igor.alexeenko): Update equator discretely, only when active chunk
    // changes.
    var equator = this.getEquator_(editor);

    var currentOffsetIndex = this.getCurrentOffset_(
        scrollPosition.top + equator,
        this.offsets_,
        isOriginalEditor);

    var currentOffset = this.offsets_[currentOffsetIndex];

    var currentTop = isOriginalEditor ? currentOffset.topOriginal :
        currentOffset.topModified;
    var oppositeTop = isOriginalEditor ? currentOffset.topModified :
        currentOffset.topOriginal;
    var currentBottom = isOriginalEditor ? currentOffset.bottomOriginal :
        currentOffset.bottomModified;
    var oppositeBottom = isOriginalEditor ? currentOffset.bottomModified :
        currentOffset.bottomOriginal;

    var offsetHeight = currentBottom - currentTop;
    var scrollTop = scrollPosition.top - currentTop + equator;

    var ratio = scrollTop / offsetHeight;

    var oppositeOffsetHeight = oppositeBottom - oppositeTop;

    var oppositeScroll = Math.round(oppositeOffsetHeight * ratio);
    var oppositeScrollTop = oppositeScroll + oppositeTop - equator;

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
   * @private
   */
  diffTool.DoubleEditorController.prototype.colorizeLines_ = function() {
    var previousIsChanged = false;

    this.lines_.forEach(function(chunk) {
      this.colorizeChunk_(chunk.topOriginal, chunk.bottomOriginal,
          chunk.rangesOriginal,  chunk.type, this.codeMirrorOriginal_,
          previousIsChanged);

      this.colorizeChunk_(chunk.topModified, chunk.bottomModified,
          chunk.rangesModified, chunk.type, this.codeMirrorModified_,
          previousIsChanged);

      previousIsChanged = !diffTool.Parser.lineHasType(chunk,
          diffTool.Parser.LineType.UNCHANGED);
    }, this);
  };

  /**
   * Adds class, according to modification type, to bunch of lines in editor.
   * @param {number} from
   * @param {number} to
   * @param {Array.<Object>} ranges
   * @param {diffTool.Parser.LineType} type
   * @param {CodeMirror} editor
   * @param {boolean=} opt_changesBefore
   * @private
   */
  diffTool.DoubleEditorController.prototype.colorizeChunk_ = function(from, to,
      ranges, type, editor, opt_changesBefore) {
    if (!this.lineTypeToClass_) {
      /**
       * Lookup table of line states to
       * @type {Object.<diffTool.DoubleEditorController.ModificationType,
       *     diffTool.DoubleEditorController.LineClass>}
       * @private
       */
      this.lineTypeToClass_ = diffTool.createObject(
          diffTool.Parser.LineType.UNCHANGED, '',
          diffTool.Parser.LineType.INLINE,
              diffTool.DoubleEditorController.LineClass.MODIFIED,
          diffTool.Parser.LineType.DELETED,
              diffTool.DoubleEditorController.LineClass.DELETED,
          diffTool.Parser.LineType.ADDED,
              diffTool.DoubleEditorController.LineClass.ADDED);
    }

    if (!this.collapsedLineTypeToClass_) {
      /**
       * @type {Object.<diffTool.DoubleEditorController.ModificationType,
       *     diffTool.DoubleEditorController.LineClass>}
       * @private
       */
      this.collapsedLineTypeToClass_ = diffTool.createObject(
          diffTool.Parser.LineType.ADDED,
              diffTool.DoubleEditorController.LineClass.BEFORE_ADDED,
          diffTool.Parser.LineType.DELETED,
              diffTool.DoubleEditorController.LineClass.BEFORE_DELETED);
    }

    if (from === to) {
      editor.addLineClass(from - 1, diffTool.DoubleEditorController.EDITOR_MODE,
          this.collapsedLineTypeToClass_[type]);
    }

    for (var i = from, rangeIndex = 0; i < to; i++, rangeIndex++) {
      if (i === from && type !== diffTool.Parser.LineType.UNCHANGED &&
          !opt_changesBefore) {
        editor.addLineClass(i, diffTool.DoubleEditorController.EDITOR_MODE,
            diffTool.DoubleEditorController.LineClass.FIRST);
      }

      if (i === to - 1 && type !== diffTool.Parser.LineType.UNCHANGED) {
        editor.addLineClass(i, diffTool.DoubleEditorController.EDITOR_MODE,
            diffTool.DoubleEditorController.LineClass.LAST);
      }

      editor.addLineClass(i, diffTool.DoubleEditorController.EDITOR_MODE,
          this.lineTypeToClass_[type]);

      if (ranges) {
        this.colorizeLine_(i, ranges[rangeIndex], editor);
      }
    }
  };

  /**
   * Highlights inline changes.
   * @param {number} line
   * @param {Array.<Object>} ranges
   * @param {CodeMirror} editor
   * @private
   */
  diffTool.DoubleEditorController.prototype.colorizeLine_ = function(line,
      ranges, editor) {
    if (ranges)  {
      if (!this.rangeTypeToClass_) {
        this.rangeTypeToClass_ = diffTool.createObject(
            diffTool.Parser.LineType.UNCHANGED, '',
            diffTool.Parser.LineType.DELETED,
                diffTool.DoubleEditorController.CharsClass.MODIFIED,
            diffTool.Parser.LineType.ADDED,
                diffTool.DoubleEditorController.CharsClass.MODIFIED);
      }

      ranges.forEach(function(range) {
        editor.markText({
          line: line,
          ch: range.from
        }, {
          line: line,
          ch: range.to
        }, {
          className: this.rangeTypeToClass_[range.type]
        });
      }, this);
    }
  };

  /**
   * Draws graphics connectors from changed chunks in original code to
   * corresponding chunks in modified code.
   * @param {boolean=} opt_redraw If true, resizes canvas.
   * @private
   */
  diffTool.DoubleEditorController.prototype.drawConnectors_ = function(
      opt_redraw) {
    if (!this.splitElement_) {
      this.splitElement_ = this.element_.querySelector(
          diffTool.DoubleEditorController.CssSelector.SPLITTER);
    }

    var width = this.splitElement_.clientWidth;
    var originalScrollInfo = this.codeMirrorOriginal_.getScrollInfo();
    var modifiedScrollInfo = this.codeMirrorModified_.getScrollInfo();

    if (!this.connectorsCanvas_) {
      this.connectorsCanvas_ = raphael(this.splitElement_);
      opt_redraw = true;
    }

    if (opt_redraw) {
      this.connectorsCanvas_.setSize(
          this.splitElement_.clientWidth,
          this.splitElement_.clientHeight);
    }

    this.connectorsCanvas_.clear();

    if (!this.typeToFill_) {
      // todo(igor.alexeenko): Unify this colours with variables from css.
      this.typeToFill_ = diffTool.createObject(
          diffTool.Parser.LineType.INLINE, '#e9effc',
          diffTool.Parser.LineType.DELETED, '#d6d6d6',
          diffTool.Parser.LineType.ADDED, '#c8f0c9');
    }

    var editorOffset = this.codeMirrorOriginal_.getScrollInfo();
    var editorOffsetTop = editorOffset.top;
    var editorOffsetBottom = editorOffsetTop + editorOffset.clientHeight;

    this.offsets_.forEach(function(offset) {
      var offsetHeight = offset.bottomOriginal - offset.topOriginal;
      var topEdge = editorOffsetTop - offsetHeight;
      var bottomEdge = editorOffsetBottom + offsetHeight;

      if (!diffTool.Parser.lineHasType(offset,
          diffTool.Parser.LineType.UNCHANGED) &&
          offset.topOriginal > topEdge &&
          offset.bottomOriginal < bottomEdge) {
        var originalTop = offset.topOriginal - originalScrollInfo.top;
        var modifiedTop = offset.topModified - modifiedScrollInfo.top;

        var originalBottom = offset.bottomOriginal - originalScrollInfo.top;
        var modifiedBottom = offset.bottomModified - modifiedScrollInfo.top;

        var attrs = {
          fill: this.typeToFill_[offset.type],
          opacity: 1,
          stroke: '#969696',
          'stroke-linecap': 'round',
          'stroke-width': '1px'
        };

        this.connectorsCanvas_.path(
        [
          ['M', 0, originalTop],
          [
            'C', width * 0.2, originalTop,
            width * 0.8, modifiedTop,
            width, modifiedTop
          ],
          [
            'L', width, modifiedBottom
          ],
          [
            'C',
            width * 0.8, modifiedBottom,
            width * 0.2, originalBottom,
            0, originalBottom
          ],
          [
            'L', 0, originalTop
          ]
        ]).attr(attrs);
      }
    }, this);
  };

  /**
   * Enables/disabled event listeners on editor, which causes correction
   * of scroll position of opposite editor.
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
   * @return {Array.<Object>}
   * @private
   */
  diffTool.DoubleEditorController.prototype.getLinesOffset_ = function(lines) {
    var offsets = [];

    lines.forEach(function(line) {
      offsets.push({
        bottomModified: this.codeMirrorModified_.heightAtLine(
            line.bottomModified),
        bottomOriginal: this.codeMirrorOriginal_.heightAtLine(
            line.bottomOriginal),
        topModified: this.codeMirrorModified_.heightAtLine(line.topModified),
        topOriginal: this.codeMirrorOriginal_.heightAtLine(line.topOriginal),
        type: line.type
      });
    }, this);

    return offsets;
  };

  /**
   * Returns index of object which represents pixel offsets of current
   * chunk of code.
   * @param {number} scrollPosition
   * @param {Array.<Object>} offsets
   * @param {boolean} isOriginalCode
   * @return {number}
   * @private
   */
  diffTool.DoubleEditorController.prototype.getCurrentOffset_ = function(
      scrollPosition, offsets, isOriginalCode) {
    var offset;
    var top, bottom;

    for (var i = 0, l = offsets.length; offset = offsets[i], i < l; i++) {
      top = isOriginalCode ? offset.topOriginal : offset.topModified;
      bottom = isOriginalCode ? offset.bottomOriginal : offset.bottomModified;

      if (top <= scrollPosition && bottom >= scrollPosition) {
        return i;
      }
    }

    return l - 1;
  };

  return diffTool.DoubleEditorController;
});
