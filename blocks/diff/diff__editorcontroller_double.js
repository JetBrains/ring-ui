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
  'diff/diff__parser_doublepane',
  'jquery'
], function(diffTool, CodeMirror, Handlebars, raphael) {

  // todo(igor.alexeenko): Implement all DOM-specific, CodeMirror-
  // specific and Raphael-specific logic in some kind of Renderer,
  // because Raphael, CodeMirror and Handlebars has an issues and could be
  // replaced by another.

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
   * ID of mode in which {@link CodeMirror} counts offsets of lines.
   * @type {string}
   * @const
   */
  diffTool.DoubleEditorController.EDITOR_SCREEN_MODE = 'local';

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

  // todo(igor.alexeenko): Check, whether old IE supports classes for VML
  // elements or should I have to implement this another way.
  /**
   * Classes, which applies to SVG connectors
   * @enum {string}
   */
  diffTool.DoubleEditorController.ConnectorClass = {
    ADDED: 'diff__connector_added',
    BASE: 'diff__connector',
    DELETED: 'diff__connector_deleted',
    MODIFIED: 'diff__connector_modified'
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
    this.unbindEditors_();

    if (this.codeMirrorOriginal_.getValue() !== original) {
      this.codeMirrorOriginal_.setValue(original);
    }

    if (this.codeMirrorModified_.getValue() !== modified) {
      this.codeMirrorModified_.setValue(modified);
    }

    this.bindEditors_(original, modified, diff);

    this.checkScroll_();
  };

  /**
   * Checks, whether first change is outside viewport and scrolls editor
   * to make it visible if so.
   * @private
   */
  diffTool.DoubleEditorController.prototype.checkScroll_ = function() {
    // todo(igor.alexeenko): Get rid of this const, count line height and
    // scroll to two lines before first changed.
    /**
     * @type {number}
     * @const
     */
    var GAP = 50;
    var firstChangedOffset = this.getFirstChanged_();

    var firstChangedIsInViewport = (
        diffTool.DoubleEditorController.isInEditorViewport(
            firstChangedOffset.topOriginal, firstChangedOffset.topModified,
            this.codeMirrorOriginal_) ||
        diffTool.DoubleEditorController.isInEditorViewport(
            firstChangedOffset.bottomModified, firstChangedOffset.bottomOriginal,
            this.codeMirrorModified_));

    if (!firstChangedIsInViewport) {
      this.codeMirrorOriginal_.scrollTo(0,
          firstChangedOffset.topOriginal - GAP);
    }
  };

  /**
   * Returns first offset which was marked as changed.
   * @return {Object?}
   * @private
   */
  diffTool.DoubleEditorController.prototype.getFirstChanged_ = function() {
    /**
     * @type {Object}
     */
    var currentOffset;

    for (var i = 0, l = this.offsets_.length; i < l; i++) {
      currentOffset = this.offsets_[i];

      if (!diffTool.Parser.lineHasType(currentOffset,
          diffTool.Parser.LineType.UNCHANGED)) {
        return currentOffset;
      }
    }

    return null;
  };

  /**
   * @param {number} from
   * @param {number} to
   * @param {CodeMirror} editor
   * @return {boolean}
   */
  diffTool.DoubleEditorController.isInEditorViewport = function(from, to,
                                                                editor) {
    var editorScrollInfo = editor.getScrollInfo();
    var offsetHeight = to - from;

    var topEdge = editorScrollInfo.top - offsetHeight;
    var bottomEdge = editorScrollInfo.top + editorScrollInfo.clientHeight +
        offsetHeight;

    return from >= topEdge && to <= bottomEdge;
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

    if (!this.colorizedLines_) {
      /**
       * {@code Array} of Objects, which contains numbers of lines in modified
       * and original code to be marked. Used for clean-up editor before
       * re-highlighting.
       * @type {Array.<Object>}
       * @private
       */
      this.colorizedLines_ = [];

      /**
       * {@code Array} of inline markers, which returned by {@code CodeMirror}.
       * Used for clean-up editor.
       * @type {Array.<CodeMirror.TextMarker>}
       * @private
       */
      this.textMarkers_ = [];
    }

    this.cleanupColorized_();

    this.lines_.forEach(function(chunk) {
      if (!diffTool.Parser.lineHasType(chunk,
          diffTool.Parser.LineType.UNCHANGED)) {
        this.colorizeChunk_(chunk.topOriginal, chunk.bottomOriginal,
            chunk.rangesOriginal,  chunk.type, this.codeMirrorOriginal_,
            previousIsChanged);

        this.colorizeChunk_(chunk.topModified, chunk.bottomModified,
            chunk.rangesModified, chunk.type, this.codeMirrorModified_,
            previousIsChanged);
      }

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

    // fixme(igor.alexeenko): There's no place for logic like that. This
    // all should be inside following for loop.
    if (from === to) {
      editor.addLineClass(from - 1, diffTool.DoubleEditorController.EDITOR_MODE,
          this.collapsedLineTypeToClass_[type]);

      this.colorizedLines_.push({
        editor: editor,
        from: from - 1,
        to: from
      });
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

    this.colorizedLines_.push({
      editor: editor,
      from: from,
      to: to
    });
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
        this.textMarkers_.push(editor.markText({
          line: line,
          ch: range.from
        }, {
          line: line,
          ch: range.to
        }, {
          className: this.rangeTypeToClass_[range.type]
        }));
      }, this);
    }
  };

  /**
   * Removes markup of previously highlighted lines.
   * @private
   */
  diffTool.DoubleEditorController.prototype.cleanupColorized_ = function() {
    this.colorizedLines_.forEach(function(chunk) {
      for (var i = chunk.from; i < chunk.to; i++) {
        chunk.editor.removeLineClass(i,
            diffTool.DoubleEditorController.EDITOR_MODE);
      }
    });

    this.textMarkers_.forEach(function(marker) {
      marker.clear();
      marker = null;
    });

    this.colorizedLines_.length = 0;
    this.textMarkers_.length = 0;
  };

  // todo(igor.alexeenko): Refactor: remove complexity.
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

    /**
     * @type {number}
     * @const
     */
    var SUBPIXEL_ERROR = 1;

    var width = this.splitElement_.offsetWidth;
    var originalScrollInfo = this.codeMirrorOriginal_.getScrollInfo();
    var modifiedScrollInfo = this.codeMirrorModified_.getScrollInfo();

    if (!this.connectorsCanvas_) {
      this.connectorsCanvas_ = raphael(this.splitElement_, 0, 0);
      opt_redraw = true;
    }

    if (opt_redraw) {
      this.connectorsCanvas_.setSize(
          this.splitElement_.offsetWidth,
          this.splitElement_.offsetHeight);
    }

    this.connectorsCanvas_.clear();

    if (!this.typeToSvgClass_) {
      /**
       * Lookup table of types of line to css-classes for according connector
       * elements.
       * @type {Object.<diffTool.Parser.LineType,
       *     diffTool.DoubleEditorController.ConnectorClass>}
       * @private
       */
      this.typeToSvgClass_ = diffTool.createObject(
          diffTool.Parser.LineType.ADDED,
              diffTool.DoubleEditorController.ConnectorClass.ADDED,
          diffTool.Parser.LineType.DELETED,
              diffTool.DoubleEditorController.ConnectorClass.DELETED,
          diffTool.Parser.LineType.INLINE,
              diffTool.DoubleEditorController.ConnectorClass.MODIFIED);
    }

    var editorOffset = this.codeMirrorOriginal_.getScrollInfo();
    var editorOffsetTop = editorOffset.top;
    var editorOffsetBottom = editorOffsetTop + editorOffset.clientHeight;

    var previousOffset = null;

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

        var originalBottom = offset.bottomOriginal - originalScrollInfo.top -
            SUBPIXEL_ERROR;
        var modifiedBottom = offset.bottomModified - modifiedScrollInfo.top -
            SUBPIXEL_ERROR;

        if ((Boolean(previousOffset) &&
            !diffTool.Parser.lineHasType(previousOffset,
                diffTool.Parser.LineType.UNCHANGED) &&
            !diffTool.Parser.lineHasType(offset,
                diffTool.Parser.LineType.UNCHANGED)) ||
            /*
             * todo(igor.alexeenko): find out, why same condition does not
             * work for opposite situation: when offset.topModified ===
             * offset.bottomModified.
             */
            offset.topOriginal === offset.bottomOriginal) {
          originalTop -= SUBPIXEL_ERROR;
          modifiedTop -= SUBPIXEL_ERROR;
        }

        // todo(igor.alexeenko): getConnectorClass(type)
        var connectorClassName = [
          diffTool.DoubleEditorController.ConnectorClass.BASE,
          this.typeToSvgClass_[offset.type]
        ].join(' ');

        var leftEdge = -1;
        var leftCorrPoint = Math.round(width *
            diffTool.DoubleEditorController.CONNECTOR_CURVE_RATIO);
        var rightCorrPoint = Math.round(width - width *
            diffTool.DoubleEditorController.CONNECTOR_CURVE_RATIO);
        var rightEdge = width + 1;

        var connector = this.connectorsCanvas_.path([
          ['M', leftEdge, originalTop],
          ['C',
            leftCorrPoint, originalTop,
            rightCorrPoint, modifiedTop,
            rightEdge, modifiedTop],
          ['L', rightEdge, modifiedBottom],
          ['C',
            rightCorrPoint, modifiedBottom,
            leftCorrPoint, originalBottom,
            leftEdge, originalBottom],
          ['L', leftEdge, originalTop, 'Z']
        ]);
        connector.node.setAttribute('class', connectorClassName);
        connector.node.setAttribute('transform', 'translate(0.5, 0.5)');
      }

      previousOffset = offset;
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
    if (!this.scrollHandler_) {
      /**
       * Scroll handler which calls method
       * of {@code diffTool.DoubleEditorController} with bind context.
       * @type {Function}
       * @private
       */
      this.scrollHandler_ = diffTool.bindContext(this.onScroll_, this);
    }

    if (enabled) {
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
      var offset = {
        bottomModified: this.codeMirrorModified_.heightAtLine(
            line.bottomModified,
            diffTool.DoubleEditorController.EDITOR_SCREEN_MODE),
        bottomOriginal: this.codeMirrorOriginal_.heightAtLine(
            line.bottomOriginal,
            diffTool.DoubleEditorController.EDITOR_SCREEN_MODE),
        topModified: this.codeMirrorModified_.heightAtLine(
            line.topModified,
            diffTool.DoubleEditorController.EDITOR_SCREEN_MODE),
        topOriginal: this.codeMirrorOriginal_.heightAtLine(
            line.topOriginal,
            diffTool.DoubleEditorController.EDITOR_SCREEN_MODE),
        type: line.type
      };

      offsets.push(offset);
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

  /**
   * @return {CodeMirror}
   */
  diffTool.DoubleEditorController.prototype.getOriginalEditor = function() {
    return this.codeMirrorOriginal_;
  };

  /**
   * @return {CodeMirror}
   */
  diffTool.DoubleEditorController.prototype.getModifiedEditor = function() {
    return this.codeMirrorModified_;
  };

  return diffTool.DoubleEditorController;
});
