/* global CodeMirror: true */

/**
 * @fileoverview Controller for double-pane editor.
 * @author igor.alexeenko (Igor Alexeenko)
 */

define([
  'jquery',
  'handlebars',
  'raphael',
  'diff/diff__tools',
  'global/global__codemirror-helper',
  'diff/diff__editorcontroller',
  'diff/diff__parser_doublepane'
], function($, Handlebars, raphael, d, CodeMirrorHelper) {

  // todo(igor.alexeenko): Implement all DOM-specific, CodeMirror-
  // specific and Raphael-specific logic in some kind of Renderer,
  // because Raphael, CodeMirror and Handlebars has an issues and could be
  // replaced by other solutions.

  /**
   * @param {Element} element
   * @constructor
   * @extends {d.EditorController}
   */
  d.DoubleEditorController = function(element) {
    d.DoubleEditorController.super_.constructor.call(this, element,
        true, d.ParserDoublePane.getInstance());
  };
  d.inherit(d.DoubleEditorController, d.EditorController);

  /**
   * Approximate time, which needed to correctly scroll opposite editor.
   * @type {number}
   * @const
   */
  d.DoubleEditorController.SCROLL_TIMEOUT = 200;

  /**
   * Equator ratio is a ratio of height of editor on which speed of scrolling
   * of chunks of corresponding code in opposite editor changes.
   * @type {number}
   * @const
   */
  d.DoubleEditorController.EQUATOR_RATIO = 0.5;

  /**
   * ID of coloring mode for {@link CodeMirror} in which we colorize lines.
   * @type {string}
   * @const
   */
  d.DoubleEditorController.EDITOR_MODE = 'background';

  /**
   * ID of mode in which {@link CodeMirror} counts offsets of lines.
   * @type {string}
   * @const
   */
  d.DoubleEditorController.EDITOR_SCREEN_MODE = 'local';

  /**
   * Classes, which appends to lines in {@link CodeMirror}.
   * @enum {string}
   */
  d.DoubleEditorController.LineClass = {
    ADDED: 'line__added',
    BEFORE_ADDED: 'line__before_added',
    BEFORE_DELETED: 'line__before_deleted',
    DELETED: 'line__deleted',
    FIRST: 'line__first',
    LAST: 'line__last',
    MODIFIED: 'line__modified'
  };

  /**
   * Classes, which appends to chars to highlight inline changes.
   * @enum {string}
   */
  d.DoubleEditorController.CharsClass = {
    ADDED: 'chars__added',
    DELETED: 'chars__deleted',
    MODIFIED: 'chars__modified'
  };

  // todo(igor.alexeenko): Check, whether old IE supports classes for VML
  // elements or should I have to implement this another way.
  /**
   * Classes, which applies to SVG connectors
   * @enum {string}
   */
  d.DoubleEditorController.ConnectorClass = {
    ADDED: 'diff__connector_added',
    BASE: 'diff__connector',
    DELETED: 'diff__connector_deleted',
    MODIFIED: 'diff__connector_modified'
  };

  /**
   * IDs of templates for {@link Handlebars}.
   * @enum {string}
   */
  d.DoubleEditorController.Template = {
    BASE: 'diff_doublepane'
  };

  /**
   * Selectors of editor DOM-elements.
   * @enum {string}
   */
  d.DoubleEditorController.CssSelector = {
    BASE: '.diff_doublepane',
    ORIGINAL: '.diff__original',
    MODIFIED: '.diff__modified',
    SPLITTER: '.diff__split'
  };

  /**
   * Returns object which represents options for given instance of editor.
   * @static
   * @param {CodeMirror} editor
   * @return {Object}
   */
  d.DoubleEditorController.getEditorOptions = function() {
    return {
      lineNumbers: true,
      matchBrackets: true,
      mode: {
        name: 'text/x-java'
      },
      readOnly: true,
      viewportMargin: 1
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
  d.DoubleEditorController.getMaxScroll_ = function(editor) {
    var scrollInfo = editor.getScrollInfo();
    return scrollInfo.width - scrollInfo.clientWidth;
  };

  /**
   * @override
   */
  d.DoubleEditorController.prototype.setEnabledInternal = function(
      enabled) {
    if (enabled) {
      this.element_.innerHTML = Handlebars.partials[
          d.DoubleEditorController.Template.BASE]();

      this.originalElement_ = this.element_.querySelector(
          d.DoubleEditorController.CssSelector.ORIGINAL);
      this.modifiedElement_ = this.element_.querySelector(
          d.DoubleEditorController.CssSelector.MODIFIED);

      this.codeMirrorOriginal_ = new CodeMirror(this.originalElement_,
          d.DoubleEditorController.getEditorOptions());
      this.codeMirrorModified_ = new CodeMirror(this.modifiedElement_,
          d.DoubleEditorController.getEditorOptions());
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
  d.DoubleEditorController.prototype.setContentInternal = function(
      original, modified, diff, opt_refresh) {
    this.unbindEditors_();

    if (this.codeMirrorOriginal_.getValue() !== original) {
      this.codeMirrorOriginal_.setValue(original);
    }

    if (this.codeMirrorModified_.getValue() !== modified) {
      this.codeMirrorModified_.setValue(modified);
    }

    this.bindEditors_(original, modified, diff, opt_refresh);

    if (!Boolean(opt_refresh)) {
      this.checkScroll_();
    }
  };

  /**
   * Checks, whether first change is outside viewport and scrolls editor
   * to make it visible if so.
   * @private
   */
  d.DoubleEditorController.prototype.checkScroll_ = function() {
    /**
     * @type {number}
     * @const
     */
    var GAP = 50;
    var firstChangedOffset = this.getFirstChanged_();

    var firstChangedIsInViewport = (
        d.DoubleEditorController.isInEditorViewport(
            firstChangedOffset.originalFrom, firstChangedOffset.modifiedFrom,
            this.codeMirrorOriginal_) ||
        d.DoubleEditorController.isInEditorViewport(
            firstChangedOffset.modifiedTo, firstChangedOffset.originalTo,
            this.codeMirrorModified_));

    if (!firstChangedIsInViewport) {
      this.codeMirrorOriginal_.scrollTo(0,
          firstChangedOffset.originalFrom - GAP);
    }
  };

  /**
   * Returns first offset which was marked as changed.
   * @return {Object?}
   * @private
   */
  d.DoubleEditorController.prototype.getFirstChanged_ = function() {
    /**
     * @type {Object}
     */
    for (var i = 0, l = this.offsets_.length; i < l; i++) {
      var currentOffset = this.offsets_[i];
      var currentLine = this.lines_[i];

      if (currentLine.type !== d.Parser.LineType.UNCHANGED) {
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
  d.DoubleEditorController.isInEditorViewport = function(from, to, editor) {
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
   * @param {d.Parser.Diff} diff
   * @private
   */
  d.DoubleEditorController.prototype.bindEditors_ = function(
      original, modified, diff) {
    /**
     * @type {number}
     * @private
     */
    this.originalEditorMaxWidth_ = d.DoubleEditorController.getMaxScroll_(
        this.codeMirrorOriginal_);

    /**
     * @type {number}
     * @private
     */
    this.modifiedEditorMaxWidth_ = d.DoubleEditorController.
        getMaxScroll_(this.codeMirrorModified_);

    /**
     * Parser output, which contains information about lines.
     * @type {d.Parser.Output}
     * @private
     */
    this.lines_ = this.codeParser_.parse(original, modified, diff);

    /**
     * Object with coordinates of chunks of original code and corresponding
     * chunks from modified code.
     * @type {Array.<Object>}
     * @private
     */
    this.offsets_ = this.getPxOffsets_(this.lines_);

    this.setEditorScrollHandlerEnabled_(this.codeMirrorOriginal_, true);
    this.setEditorScrollHandlerEnabled_(this.codeMirrorModified_, true);

    this.colorizeLines_();
    this.drawConnectors_();

    if (!this.resizeHandler_) {
      this.resizeHandler_ = d.bindContext(this.onResize_, this);
    }

    $(window).on('resize', this.resizeHandler_);
  };

  /**
   * @param {Array.<Object>} offsets
   * @return {Array.<Object>}
   * @private
   */
  d.DoubleEditorController.prototype.getPxOffsets_ = function(offsets) {
    var pxOffsets = [];

    offsets.forEach(function(offset) {
      pxOffsets.push({
        originalFrom: this.codeMirrorOriginal_.heightAtLine(
            offset.originalFrom, d.DoubleEditorController.EDITOR_SCREEN_MODE),
        originalTo: this.codeMirrorOriginal_.heightAtLine(
            offset.originalTo, d.DoubleEditorController.EDITOR_SCREEN_MODE),
        modifiedFrom: this.codeMirrorModified_.heightAtLine(
            offset.modifiedFrom, d.DoubleEditorController.EDITOR_SCREEN_MODE),
        modifiedTo: this.codeMirrorModified_.heightAtLine(
            offset.modifiedTo, d.DoubleEditorController.EDITOR_SCREEN_MODE)
      });
    }, this);

    return pxOffsets;
  };

  /**
   * Remove scroll handlers and destroy connectors.
   * @private
   */
  d.DoubleEditorController.prototype.unbindEditors_ = function() {
    this.setEditorScrollHandlerEnabled_(this.codeMirrorOriginal_, false);
    this.setEditorScrollHandlerEnabled_(this.codeMirrorModified_, false);

    $(window).off('resize', this.resizeHandler_);
  };

  /**
   * Handles window resize.
   * @private
   */
  d.DoubleEditorController.prototype.onResize_ = function() {
    this.drawConnectors_(true);
  };

  /**
   * Disables opposite editor to prevent feedback loops from scroll event
   * @param {CodeMirror} target
   * @private
   */
  d.DoubleEditorController.prototype.onScroll_ = function(target) {
    var oppositeEditor = (target === this.codeMirrorOriginal_) ?
        this.codeMirrorModified_ :
        this.codeMirrorOriginal_;

    if (this.disabledEditor_ && oppositeEditor !== this.disabledEditor_) {
      return;
    }

    clearTimeout(this.disableEditorTimeout_);

    if (!this.disabledEditor_ || oppositeEditor !== this.disabledEditor_) {
      this.setEditorScrollHandlerEnabled_(oppositeEditor, false);

      /**
       * @type {CodeMirror}
       * @private
       */
      this.disabledEditor_ = oppositeEditor;
    }

    this.syncScroll_(target);
    this.drawConnectors_();

    this.disableEditorTimeout_ = setTimeout(d.bindContext(function() {
      this.setEditorScrollHandlerEnabled_(this.disabledEditor_, true);
      this.disabledEditor_ = null;
    }, this), d.DoubleEditorController.SCROLL_TIMEOUT);
  };

  /**
   * @param {CodeMirror} editor
   * @private
   */
  d.DoubleEditorController.prototype.syncScroll_ = function(editor) {
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

    var currentTop = isOriginalEditor ? currentOffset.originalFrom :
        currentOffset.modifiedFrom;
    var oppositeTop = isOriginalEditor ? currentOffset.modifiedFrom :
        currentOffset.originalFrom;
    var currentBottom = isOriginalEditor ? currentOffset.originalTo :
        currentOffset.modifiedTo;
    var oppositeBottom = isOriginalEditor ? currentOffset.modifiedTo :
        currentOffset.originalTo;

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
  d.DoubleEditorController.prototype.getEquator_ = function(editor) {
    var editorScrollInfo = editor.getScrollInfo();
    var equator;

    if (this.isLastScreen_(editor)) {
      equator = editorScrollInfo.clientHeight - (editorScrollInfo.height -
          editorScrollInfo.top - editorScrollInfo.clientHeight);
    } else {
      equator = Math.round(editorScrollInfo.clientHeight *
          d.DoubleEditorController.EQUATOR_RATIO);
    }

    return equator;
  };

  /**
   * Enables/disabled event listeners on editor, which causes correction
   * of scroll position of opposite editor.
   * @param {CodeMirror} editor
   * @param {boolean} enabled
   * @private
   */
  d.DoubleEditorController.prototype.setEditorScrollHandlerEnabled_ = function(
      editor, enabled) {
    if (!this.scrollHandler_) {
      /**
       * Scroll handler which calls method
       * of {@code d.DoubleEditorController} with bind context.
       * @type {Function}
       * @private
       */
      this.scrollHandler_ = d.bindContext(this.onScroll_, this);
    }

    if (enabled) {
      CodeMirror.on(editor, 'scroll', this.scrollHandler_);
    } else {
      CodeMirror.off(editor, 'scroll', this.scrollHandler_);
    }
  };

  /**
   * Returns true if below height of code below the bottom line of editor
   * is lower than offset to equator, which means that code below may not
   * ever reach equator.
   * @return {boolean}
   * @private
   */
  d.DoubleEditorController.prototype.isLastScreen_ = function(editor) {
    var scrollInfo = editor.getScrollInfo();

    return (scrollInfo.height - scrollInfo.top <=
        scrollInfo.clientHeight + (scrollInfo.clientHeight -
            scrollInfo.clientHeight *
                d.DoubleEditorController.EQUATOR_RATIO));
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
  d.DoubleEditorController.prototype.getCurrentOffset_ = function(
      scrollPosition, offsets, isOriginalCode) {
    var offset;
    var top, bottom;

    for (var i = 0, l = offsets.length; offset = offsets[i], i < l; i++) {
      top = isOriginalCode ? offset.originalFrom : offset.modifiedFrom;
      bottom = isOriginalCode ? offset.originalTo : offset.modifiedTo;

      if (top <= scrollPosition && bottom >= scrollPosition) {
        return i;
      }
    }

    return l - 1;
  };

  /**
   * @private
   */
  d.DoubleEditorController.prototype.colorizeLines_ = function() {
    var cmHelper = CodeMirrorHelper.getInstance();

    this.lines_.forEach(function(chunk, index) {
      if (!chunk.type) {
        return;
      }

      var originalChunkSize = chunk.originalTo - chunk.originalFrom;
      var modifiedChunkSize = chunk.modifiedTo - chunk.modifiedFrom;

      var nextChunkType = this.lines_[index + 1] ? this.lines_[index + 1].type :
          null;

      var usedLine;
      var lineClass;

      // NB! I use post-test loop because some chunks contains only one
      // lines and "from" and "to" numbers are equal.
      var i = chunk.originalFrom;
      do {
        usedLine = (originalChunkSize === 0) ? i - 1 : i;
        lineClass = d.DoubleEditorController.getLineClass(chunk.type, usedLine,
            chunk.originalFrom, chunk.originalTo, nextChunkType);

        d.DoubleEditorController.colorizeLine(this.codeMirrorOriginal_,
            usedLine, lineClass);

        i++;
      } while (i < chunk.originalTo);

      i = chunk.modifiedFrom;
      do {
        usedLine = (modifiedChunkSize === 0) ? i - 1 : i;
        lineClass = d.DoubleEditorController.getLineClass(chunk.type, usedLine,
            chunk.modifiedFrom, chunk.modifiedTo, nextChunkType);

        d.DoubleEditorController.colorizeLine(this.codeMirrorModified_,
            usedLine, lineClass);
        i++;
      } while (i < chunk.modifiedTo);
    }, this);

    cmHelper.executeOperationBuffer(this.codeMirrorOriginal_);
    cmHelper.executeOperationBuffer(this.codeMirrorModified_);
  };

  /**
   * Colorizes one line.
   * @param {CodeMirror} editor
   * @param {number} usedLine
   * @param {string} lineClass
   */
  d.DoubleEditorController.colorizeLine = function(editor, usedLine,
      lineClass) {
    var cmHelper = CodeMirrorHelper.getInstance();

    cmHelper.addOperation(editor, function() {
      editor.addLineClass(usedLine,
          d.DoubleEditorController.EDITOR_MODE, lineClass);
    });
  };

  /**
   * Returns list of line classes which should be added to line of given type.
   * @static
   * @param {d.Parser.LineType} type
   * @param {number} lineIndex
   * @param {number} from
   * @param {number} to
   * @param {d.Parser.LineType=} opt_nextType
   * @return {string}
   */
  d.DoubleEditorController.getLineClass = function(type, lineIndex, from, to,
      opt_nextType) {
    var classes = [];

    /**
     * Array of types, which are used in detection of CSS-class for current
     * line.
     * @type {Array.<d.Parser.LineType>}
     */
    var usedTypes = [
      d.Parser.LineType.NULL,
      d.Parser.LineType.ADDED,
      d.Parser.LineType.DELETED,
      d.Parser.LineType.INLINE
    ];

    /**
     * Lookup table of line-types to CSS-classes.
     * @type {Object.<d.Parser.LineType, string>}
     */
    var typeToLineClass = d.createObject(
        d.Parser.LineType.NULL, '',
        d.Parser.LineType.ADDED, d.DoubleEditorController.LineClass.ADDED,
        d.Parser.LineType.DELETED, d.DoubleEditorController.LineClass.DELETED,
        d.Parser.LineType.INLINE, d.DoubleEditorController.LineClass.MODIFIED,
        d.Parser.LineType.INLINE | d.Parser.LineType.ADDED,
            d.DoubleEditorController.LineClass.MODIFIED,
        d.Parser.LineType.INLINE | d.Parser.LineType.DELETED,
            d.DoubleEditorController.LineClass.MODIFIED);

    /**
     * Lookup table of line-types to CSS-classes, which are used for lines
     * before deleted or added line of code.
     * @type {Object.<d.Parser.LineType, string>}
     */
    var collapsedLineTypeToClass = d.createObject(
        d.Parser.LineType.ADDED,
        d.DoubleEditorController.LineClass.BEFORE_ADDED,
        d.Parser.LineType.DELETED,
        d.DoubleEditorController.LineClass.BEFORE_DELETED);

    var normalizedType = d.Parser.normalizeType(type, usedTypes);

    if (from === to) {
      classes.push(collapsedLineTypeToClass[normalizedType]);
    } else {
      classes.push(typeToLineClass[normalizedType]);

      if (lineIndex === from) {
        classes.push(d.DoubleEditorController.LineClass.FIRST);
      }

      if (lineIndex === to - 1 && !opt_nextType) {
        classes.push(d.DoubleEditorController.LineClass.LAST);
      }
    }

    return classes.join(' ');
  };

  /**
   * Draws graphic connectors from changed chunks in original code to
   * corresponding chunks in modified code.
   * @param {boolean=} opt_resize If true, counts new size of canvas.
   * @private
   */
  d.DoubleEditorController.prototype.drawConnectors_ = function(
      opt_resize) {
    if (!this.splitElement_) {
      /**
       * @type {Element}
       * @private
       */
      this.splitElement_ = this.element_.querySelector(
          d.DoubleEditorController.CssSelector.SPLITTER);
    }

    if (!this.connectorsCanvas_) {
      this.connectorsCanvas_ = raphael(this.splitElement_, 0, 0);
      opt_resize = true;
    }

    if (opt_resize) {
      this.connectorsCanvas_.setSize(
          this.splitElement_.offsetWidth,
          this.splitElement_.offsetHeight);
    }

    this.connectorsCanvas_.clear();

    var codeMirrorOriginalScrollInfo = this.codeMirrorOriginal_.getScrollInfo();
    var verticalRangeLeft = new d.Range(
        codeMirrorOriginalScrollInfo.top,
        codeMirrorOriginalScrollInfo.top +
            codeMirrorOriginalScrollInfo.clientHeight);

    var codeMirrorModifiedScrollInfo = this.codeMirrorModified_.getScrollInfo();
    var verticalRangeRight = new d.Range(
        codeMirrorModifiedScrollInfo.top,
        codeMirrorModifiedScrollInfo.top + codeMirrorModifiedScrollInfo.
            clientHeight);

    var horizontalRange = new d.Range(
        0, this.splitElement_.clientWidth);

    // todo(igor.alexeenko): Do I need to do something with this connectors?
    var connectors = [];

    this.offsets_.forEach(function(offset, index) {
      var currentOffset = this.lines_[index];
      var nextType = this.lines_[index + 1] ? this.lines_[index + 1].type :
          null;

      connectors.push(d.DoubleEditorController.getConnector(offset,
          verticalRangeLeft, verticalRangeRight, horizontalRange,
          currentOffset.type, this.connectorsCanvas_, nextType));
    }, this);
  };

  // todo(igor.alexeenko): Find out, what types use for Raphaël classes.
  /**
   * Creates and returns vector shape for connector.
   * @static
   * @param {Object} offset
   * @param {d.Range} verticalRangeLeft
   * @param {d.Range} verticalRangeRight
   * @param {d.Range} horizontalRange
   * @param {d.Parser.LineType} type
   * @param {Object} canvas Raphael.js canvas element
   * @param {d.Parser.LineType?} opt_nextType
   * @return {Object?}
   */
  d.DoubleEditorController.getConnector = function(offset, verticalRangeLeft,
      verticalRangeRight, horizontalRange, type, canvas, opt_nextType) {
    /**
     * Ratio of connector width on witch positioned correction point of Bézier
     * curve, which connects original and modified code.
     * @type {number}
     * @const
     */
    var CONNECTOR_CURVE_RATIO = 0.3;

    /**
     * Lookup table of line types to classes for connectors.
     * @type {Object.<d.Parser.LineType,
     *     d.DoubleEditorController.ConnectorClass>}
     */
    var typeToConnectorClass = d.createObject(
        d.Parser.LineType.ADDED,
            d.DoubleEditorController.ConnectorClass.ADDED,
        d.Parser.LineType.DELETED,
            d.DoubleEditorController.ConnectorClass.DELETED,
        d.Parser.LineType.INLINE,
            d.DoubleEditorController.ConnectorClass.MODIFIED,
        d.Parser.LineType.INLINE | d.Parser.LineType.ADDED,
            d.DoubleEditorController.ConnectorClass.MODIFIED,
        d.Parser.LineType.INLINE | d.Parser.LineType.DELETED,
            d.DoubleEditorController.ConnectorClass.MODIFIED);

    var usedTypes = [
      d.Parser.LineType.ADDED,
      d.Parser.LineType.DELETED,
      d.Parser.LineType.INLINE
    ];

    var connectorMaxHeight = Math.max(
        Math.abs(offset.modifiedTo - offset.originalTo) + (offset.originalTo -
            offset.originalFrom),
        Math.abs(offset.originalTo - offset.modifiedTo) + (offset.modifiedTo -
            offset.modifiedFrom));

    var normalizedType = d.Parser.normalizeType(type, usedTypes);

    if (offset.originalFrom >= verticalRangeLeft.from - connectorMaxHeight &&
        offset.originalTo <= verticalRangeLeft.to + connectorMaxHeight &&
        offset.modifiedFrom >= verticalRangeRight.from - connectorMaxHeight &&
        offset.modifiedTo <= verticalRangeRight.to + connectorMaxHeight &&
        normalizedType !== d.Parser.LineType.NULL) {

      horizontalRange.from -= 1;
      horizontalRange.to += 1;

      var connectorClassName = [
        d.DoubleEditorController.ConnectorClass.BASE,
        typeToConnectorClass[normalizedType]
      ].join(' ');

      var yLeftTop = offset.originalFrom - verticalRangeLeft.from;
      var xLeftTop = horizontalRange.from;

      var yLeftTopCurve = offset.originalFrom - verticalRangeLeft.from;
      var xLeftTopCurve = horizontalRange.to * CONNECTOR_CURVE_RATIO;

      var yRightTopCurve = offset.modifiedFrom - verticalRangeRight.from;
      var xRightTopCurve = horizontalRange.to * (1 - CONNECTOR_CURVE_RATIO);

      var yRightTop = offset.modifiedFrom - verticalRangeRight.from;
      var xRightTop = horizontalRange.to;

      var yRightBottom = offset.modifiedTo - verticalRangeRight.from;
      var xRightBottom = horizontalRange.to;

      var yRightBottomCurve = offset.modifiedTo - verticalRangeRight.from;
      var xRightBottomCurve = horizontalRange.to * (1 - CONNECTOR_CURVE_RATIO);

      var yLeftBottomCurve = offset.originalTo - verticalRangeLeft.from;
      var xLeftBottomCurve = horizontalRange.to * CONNECTOR_CURVE_RATIO;

      var yLeftBottom = offset.originalTo - verticalRangeLeft.from;
      var xLeftBottom = horizontalRange.from;

      if (opt_nextType === d.Parser.LineType.NULL &&
          yLeftBottom !== yLeftTop && yRightBottom !== yRightTop) {
        yLeftBottom -= 1;
        yLeftBottomCurve -= 1;
        yRightBottom -= 1;
        yRightBottomCurve -= 1;
      }

      var path = canvas.path([
        'M', xLeftTop, yLeftTop,
        ['C',
          xLeftTopCurve, yLeftTopCurve,
          xRightTopCurve, yRightTopCurve,
          xRightTop, yRightTop],
        'L', xRightBottom, yRightBottom,
        ['C',
          xRightBottomCurve, yRightBottomCurve,
          xLeftBottomCurve, yLeftBottomCurve,
          xLeftBottom, yLeftBottom],
        ['L', xLeftTop, yLeftTop, 'Z']
      ]);

      path.node.setAttribute('class', connectorClassName);
      path.node.setAttribute('transform', 'translate(0.5, 0.5)');

      return path;
    }

    return null;
  };

  /**
   * @return {CodeMirror}
   */
  d.DoubleEditorController.prototype.getOriginalEditor = function() {
    return this.codeMirrorOriginal_;
  };

  /**
   * @return {CodeMirror}
   */
  d.DoubleEditorController.prototype.getModifiedEditor = function() {
    return this.codeMirrorModified_;
  };

  return d.DoubleEditorController;
});
