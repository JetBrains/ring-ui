/* eslint-disable no-bitwise */
/**
 * @fileoverview Controller for double-pane editor.
 * @author igor.alexeenko (Igor Alexeenko)
 */

var $ = require('jquery');
var Tools = require('../diff__tools');
var Parser = require('../__parser/diff__parser');
var ParserDoublePane = require('../__parser/diff__parser_doublepane');
var EditorController = require('./diff__editorcontroller');
var DoublePaneMenu = require('../diff__doublepane-menu');
var DoubleEditorDivider = require('../diff__doublepane-divider');
var CodeMirror = require('codemirror');
var cmHelper = require('../diff__code-mirror-helper');

/**
 * @param {Element} element
 * @constructor
 * @extends {EditorController}
 */
var DoubleEditorController = function (element) {
  DoubleEditorController.super_.constructor.call(this, element, new ParserDoublePane());
  this.changes_ = [];
};
Tools.inherit(DoubleEditorController, EditorController);

/**
 * Approximate time needed to correctly scroll the opposite editor.
 * @type {number}
 * @const
 */
DoubleEditorController.SCROLL_TIMEOUT = 200;

/**
 * Equator ratio is a ratio of editor height at which scrolling speed
 * of chunks of corresponding code in the opposite editor changes.
 * @type {number}
 * @const
 */
DoubleEditorController.EQUATOR_RATIO = 0.5;

/**
 * Line coloring mode for {@link CodeMirror}.
 * http://codemirror.net/doc/manual.html#addLineClass
 * @type {string}
 * @const
 */
DoubleEditorController.EDITOR_MODE = 'background';

/**
 * Offset calculation mode for {@link CodeMirror}.
 * http://codemirror.net/doc/manual.html#coordsChar
 * @type {string}
 * @const
 */
DoubleEditorController.EDITOR_SCREEN_MODE = 'local';

/**
 * Line classes for {@link CodeMirror}.
 * @enum {string}
 */
DoubleEditorController.LineClass = {
  ADDED: 'ring-diff-line_added',
  BEFORE_ADDED: 'ring-diff-line_before-added',
  BEFORE_DELETED: 'ring-diff-line_before-deleted',
  DELETED: 'ring-diff-line_deleted',
  FIRST: 'ring-diff-line_first',
  LAST: 'ring-diff-line_last',
  MODIFIED: 'ring-diff-line_modified'
};

/**
 * Character classes (highlighting of inline changes).
 * @enum {string}
 */
DoubleEditorController.CharsClass = {
  ADDED: 'ring-diff-chars_added',
  DELETED: 'ring-diff-chars_deleted',
  MODIFIED: 'ring-diff-chars_modified',
  UNCHANGED: ''
};

// todo(igor.alexeenko): Check whether old IE supports classes for VML
// elements or should I have to implement this another way.
/**
 * SVG connector classes
 * @enum {string}
 */
DoubleEditorController.ConnectorClass = {
  ADDED: 'ring-diff__connector_added',
  BASE: 'ring-diff__connector',
  DELETED: 'ring-diff__connector_deleted',
  MODIFIED: 'ring-diff__connector_modified'
};

/**
 * @enum {string}
 */
DoubleEditorController.MapClass = {
  ADDED: 'ring-diff__map-element_added',
  BASE: 'ring-diff__map',
  ELEMENT_BASE: 'ring-diff__map-element',
  DELETED: 'ring-diff__map-element_deleted',
  MODIFIED: 'ring-diff__map-element_modified'
};

/**
 * Selectors of editor DOM elements.
 * @enum {string}
 */
DoubleEditorController.CssSelector = {
  BASE: '.ring-diff_doublepane',
  ORIGINAL: '.ring-diff__original',
  MAP: '.ring-diff__map',
  MENU: '.ring-diff__menu',
  MODIFIED: '.ring-diff__modified',
  SPLITTER: '.ring-diff__split'
};

/**
 * @enum {string}
 */
DoubleEditorController.ClassName = {
  MAP: 'ring-diff__changes-map'
};

/**
 * Returns object which represents options for given instance of editor.
 * @static
 * @return {Object}
 */
DoubleEditorController.getEditorOptions = function () {
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
 * Counts maximum value that can be set to instance of {@link CodeMirror}
 * without corrupting its scroll. Used to synchronize horizontal scroll.
 * @static
 * @param {CodeMirror} editor
 * @return {number}
 * @private
 */
DoubleEditorController.getMaxScroll_ = function (editor) {
  var scrollInfo = editor.getScrollInfo();
  return scrollInfo.width - scrollInfo.clientWidth;
};

/**
 * Whether to display whitespace changes.
 * @type {boolean}
 * @private
 */
DoubleEditorController.prototype.whitespacesEnabled_ = true;

/**
 * @override
 */
DoubleEditorController.prototype.setEnabledInternal = function (enabled) {
  var element = this.element_;

  if (enabled) {
    this.originalElement_ = element.querySelector(
      DoubleEditorController.CssSelector.ORIGINAL);
    this.modifiedElement_ = element.querySelector(
      DoubleEditorController.CssSelector.MODIFIED);

    this.codeMirrorOriginal_ = new CodeMirror(this.originalElement_,
      DoubleEditorController.getEditorOptions());
    this.codeMirrorModified_ = new CodeMirror(this.modifiedElement_,
      DoubleEditorController.getEditorOptions());

    var menuElement = element.querySelector(
      DoubleEditorController.CssSelector.MENU);
    this.menu_ = new DoublePaneMenu(menuElement);

    this.splitElement_ = element.querySelector(
      DoubleEditorController.CssSelector.SPLITTER);
    this.divider_ = new DoubleEditorDivider(this.splitElement_);

    // todo(igor.alexeenko): Code duplicate.
    var originalViewport = this.getEditorViewport(this.codeMirrorOriginal_);
    var modifiedViewport = this.getEditorViewport(this.codeMirrorModified_);
    this.divider_.setVisibleRange(originalViewport, modifiedViewport);

  } else {
    this.unbindEditors_();
    this.codeMirrorOriginal_ = null;
    this.codeMirrorModified_ = null;
    this.scrollHandler_ = null;
    this.menu_ = null;
  }
};

/**
 * @override
 */
DoubleEditorController.prototype.setContentInternal = function (original, modified, diff, opt_refresh) {
  this.unbindEditors_();

  this.allChanges_ = this.codeParser_.parse(original, modified, diff);
  this.notWhitespaceChanges_ = ParserDoublePane.ignoreWhitespaces(
    this.allChanges_);

  if (this.codeMirrorOriginal_.getValue() !== original) {
    this.codeMirrorOriginal_.setValue(original);
  }

  if (this.codeMirrorModified_.getValue() !== modified) {
    this.codeMirrorModified_.setValue(modified);
  }

  this.setWhitespacesEnabled(this.menu_.isWhitespacesEnabled());
  this.setUsedValues(this.getUsedValues_());
  this.divider_.setRanges(this.offsets_);

  if (!Boolean(opt_refresh)) {
    this.setCurrentChange(0, true);
  }
};

/**
 * @return {Array.<Parser.OutputLine>}
 * @private
 */
DoubleEditorController.prototype.getUsedValues_ = function () {
  return this.whitespacesEnabled_ ?
    this.allChanges_ :
    this.notWhitespaceChanges_;
};

/**
 * @param values
 */
DoubleEditorController.prototype.setUsedValues = function (values) {
  if (this.lines_ === values) {
    return;
  }

  this.lines_ = values;
  this.changes_ = this.getChanges_(this.lines_);
  this.offsets_ = this.getPxOffsets_(this.lines_);

  this.divider_.setRanges(this.offsets_);

  this.unbindEditors_();
  this.bindEditors_();
};

/**
 * Adds synchronized scroll to both editors and draws connectors between
 * them.
 * @private
 */
DoubleEditorController.prototype.bindEditors_ = function () {
  /**
   * @type {number}
   * @private
   */
  this.originalEditorMaxWidth_ = DoubleEditorController.getMaxScroll_(
    this.codeMirrorOriginal_);

  /**
   * @type {number}
   * @private
   */
  this.modifiedEditorMaxWidth_ = DoubleEditorController.
    getMaxScroll_(this.codeMirrorModified_);

  this.setEditorScrollHandlerEnabled_(this.codeMirrorOriginal_, true);
  this.setEditorScrollHandlerEnabled_(this.codeMirrorModified_, true);

  if (!this.splitElement_) {
    /**
     * @type {Element}
     * @private
     */
    this.splitElement_ = this.element_.querySelector(
      DoubleEditorController.CssSelector.SPLITTER);
  }

  this.colorizeLines_();
  this.divider_.redrawConnectors();
  this.drawMap_();
  this.setMenuEnabled(true);

  if (!this.resizeHandler_) {
    this.resizeHandler_ = Tools.bindContext(this.onResize_, this);
  }

  $(window).on('resize', this.resizeHandler_);
};

/**
 * @param {Array.<Object>} offsets
 * @return {Array.<number>}
 * @private
 */
DoubleEditorController.prototype.getChanges_ = function (offsets) {
  var changes = [];

  offsets.forEach(function (offset, index) {
    if (offset.type) {
      changes.push(index);
    }
  });

  return changes;
};

/**
 * @param {Array.<Object>} offsets
 * @return {Array.<Object>}
 * @private
 */
DoubleEditorController.prototype.getPxOffsets_ = function (offsets) {
  var pxOffsets = [];

  offsets.forEach(function (offset) {
    pxOffsets.push({
      originalFrom: this.codeMirrorOriginal_.heightAtLine(
        offset.originalFrom, DoubleEditorController.EDITOR_SCREEN_MODE),
      originalTo: this.codeMirrorOriginal_.heightAtLine(
        offset.originalTo, DoubleEditorController.EDITOR_SCREEN_MODE),
      modifiedFrom: this.codeMirrorModified_.heightAtLine(
        offset.modifiedFrom, DoubleEditorController.EDITOR_SCREEN_MODE) - 1,
      modifiedTo: this.codeMirrorModified_.heightAtLine(
        offset.modifiedTo, DoubleEditorController.EDITOR_SCREEN_MODE) - 1,
      type: offset.type
    });
  }, this);

  return pxOffsets;
};

/**
 * Remove scroll handlers and destroy connectors.
 * @private
 */
DoubleEditorController.prototype.unbindEditors_ = function () {
  this.setEditorScrollHandlerEnabled_(this.codeMirrorOriginal_, false);
  this.setEditorScrollHandlerEnabled_(this.codeMirrorModified_, false);

  $(window).off('resize', this.resizeHandler_);
};

/**
 * @param {jQuery.Event} evt
 * @private
 */
DoubleEditorController.prototype.onMenuUpClick_ = function (evt) {
  evt.preventDefault();
  this.setCurrentChange(this.getCurrentChange() - 1, true);
};

/**
 * @param {jQuery.Event} evt
 * @private
 */
DoubleEditorController.prototype.onMenuDownClick_ = function (evt) {
  evt.preventDefault();
  this.setCurrentChange(this.getCurrentChange() + 1, true);
};

/**
 * @param {jQuery.Event} evt
 * @private
 */
DoubleEditorController.prototype.onMenuWhitespacesOn_ = function (evt) {
  evt.preventDefault();
  this.setWhitespacesEnabled(true);
};

/**
 * @param {jQuery.Event} evt
 * @private
 */
DoubleEditorController.prototype.onMenuWhitespacesOff_ = function (evt) {
  evt.preventDefault();
  this.setWhitespacesEnabled(false);
};

/**
 * Handles window resize.
 * @private
 */
DoubleEditorController.prototype.onResize_ = function () {
//    this.drawConnectors_(true);
};

/**
 * Disables opposite editor to prevent feedback loops from scroll event
 * @param {CodeMirror} target
 * @private
 */
DoubleEditorController.prototype.onScroll_ = function (target) {
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

  var originalViewport = this.getEditorViewport(this.codeMirrorOriginal_);
  var modifiedViewport = this.getEditorViewport(this.codeMirrorModified_);
  this.divider_.setVisibleRange(originalViewport, modifiedViewport);

  if (this.lines_[this.currentOffsetIndex_].type) {
    var currentChangeIndex = this.getChangeByOffsetIndex(
      this.currentOffsetIndex_);

    this.setCurrentChange(currentChangeIndex);
  }

  this.disableEditorTimeout_ = setTimeout(Tools.bindContext(function () {
    this.setEditorScrollHandlerEnabled_(this.disabledEditor_, true);
    this.disabledEditor_ = null;
  }, this), DoubleEditorController.SCROLL_TIMEOUT);
};

/**
 * @param {CodeMirror} editor
 * @return {Tools.Range}
 */
DoubleEditorController.prototype.getEditorViewport = function (editor) {
  var editorScrollInfo = editor.getScrollInfo();

  return new Tools.Range(
    editorScrollInfo.top,
      editorScrollInfo.top + editorScrollInfo.clientHeight);
};

/**
 * @param {number} offsetIndex
 */
DoubleEditorController.prototype.getChangeByOffsetIndex = function (offsetIndex) {
  var currentChangeIndex = 0;
  this.changes_.some(function (change, changeIndex) {
    if (change === offsetIndex) {
      currentChangeIndex = changeIndex;
    }

    return change === offsetIndex;
  });

  return currentChangeIndex;
};

/**
 * @param {boolean} enabled
 */
DoubleEditorController.prototype.setWhitespacesEnabled = function (enabled) {
  if (this.whitespacesEnabled_ === enabled) {
    return;
  }

  this.whitespacesEnabled_ = enabled;
  this.setUsedValues(this.getUsedValues_());
};

/**
 * @param {CodeMirror} editor
 * @private
 */
DoubleEditorController.prototype.syncScroll_ = function (editor) {
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

  this.currentOffsetIndex_ = currentOffsetIndex;
};

/**
 * Equator is a line at which the speed of scrolling of one of the fragments changes
 * to maintain equal scroll position.
 * @param {CodeMirror} editor
 * @return {number}
 * @private
 */
DoubleEditorController.prototype.getEquator_ = function (editor) {
  var editorScrollInfo = editor.getScrollInfo();
  var equator;

  if (this.isLastScreen_(editor)) {
    equator = editorScrollInfo.clientHeight - (editorScrollInfo.height -
      editorScrollInfo.top - editorScrollInfo.clientHeight);
  } else {
    equator = Math.round(editorScrollInfo.clientHeight *
      DoubleEditorController.EQUATOR_RATIO);
  }

  return equator;
};

/**
 * Enables/disables editor scroll listeners which causes correction
 * of scroll position of the opposite editor.
 * @param {CodeMirror} editor
 * @param {boolean} enabled
 * @private
 */
DoubleEditorController.prototype.setEditorScrollHandlerEnabled_ = function (editor, enabled) {
  if (!this.scrollHandler_) {
    /**
     * Scroll handler which calls method
     * of {@code DoubleEditorController} with bind context.
     * @type {Function}
     * @private
     */
    this.scrollHandler_ = Tools.bindContext(this.onScroll_, this);
  }

  if (enabled) {
    CodeMirror.on(editor, 'scroll', this.scrollHandler_);
  } else {
    CodeMirror.off(editor, 'scroll', this.scrollHandler_);
  }
};

/**
 * Returns true if the height of code below the bottom of the editor viewport
 * is smaller than offset to equator, which means that code below may not
 * ever reach equator.
 * @return {boolean}
 * @private
 */
DoubleEditorController.prototype.isLastScreen_ = function (editor) {
  var scrollInfo = editor.getScrollInfo();

  return (scrollInfo.height - scrollInfo.top <=
    scrollInfo.clientHeight + (scrollInfo.clientHeight -
    scrollInfo.clientHeight *
    DoubleEditorController.EQUATOR_RATIO));
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
DoubleEditorController.prototype.getCurrentOffset_ = function (scrollPosition, offsets, isOriginalCode) {
  var offset;
  var top;
  var bottom;

  var length = offsets.length;
  for (var i = 0; i < length; i++) {
    offset = offsets[i];
    top = isOriginalCode ? offset.originalFrom : offset.modifiedFrom;
    bottom = isOriginalCode ? offset.originalTo : offset.modifiedTo;

    if (top <= scrollPosition && bottom >= scrollPosition) {
      return i;
    }
  }

  return length - 1;
};

/**
 * @param {boolean} enabled
 */
DoubleEditorController.prototype.setMenuEnabled = function (enabled) {
  if (this.menuIsEnabled_ === enabled) {
    return;
  }

  this.menuIsEnabled_ = enabled;

  if (enabled) {
    this.onMenuUpClick_ = Tools.bindContext(this.onMenuUpClick_, this);
    this.onMenuDownClick_ = Tools.bindContext(this.onMenuDownClick_, this);
    this.onMenuWhitespacesOn_ = Tools.bindContext(this.onMenuWhitespacesOn_,
      this);
    this.onMenuWhitespacesOff_ = Tools.bindContext(this.onMenuWhitespacesOff_,
      this);

    this.menu_.setEnabled(true);
    this.menu_.getHandler().
      on(DoublePaneMenu.EventType.UP, this.onMenuUpClick_).
      on(DoublePaneMenu.EventType.DOWN, this.onMenuDownClick_).
      on(DoublePaneMenu.EventType.WHITESPACES_ON,
      this.onMenuWhitespacesOn_).
      on(DoublePaneMenu.EventType.WHITESPACES_OFF,
      this.onMenuWhitespacesOff_);
  } else {
    this.menu_.setEnabled(false);
    this.menu_.getHandler().off();
  }
};

/**
 * @param {number} change
 * @param {boolean=} opt_scrollTo
 */
DoubleEditorController.prototype.setCurrentChange = function (change, opt_scrollTo) {
  this.currentChange_ = Tools.clamp(change, 0, this.changes_.length - 1);
  this.setCurrentChangeInternal(change, opt_scrollTo);
};

/**
 * @param {number} change
 * @param {boolean=} opt_scrollTo
 */
DoubleEditorController.prototype.setCurrentChangeInternal = function (change, opt_scrollTo) {
  if (!this.offsets_) {
    return;
  }

  /**
   * Pixels to leave to the editor edge from the scrolled element.
   * @type {number}
   * @const
   */
  var GAP = 50;

  var offsetIndex = this.changes_[change];
  var offset = this.offsets_[offsetIndex];

  // todo(igor.alexeenko): Temporary measure.
  if (!offset) {
    return;
  }

  if (opt_scrollTo) {
    var scrollOriginal = Tools.clamp(offset.originalFrom - GAP, 0, Infinity);
    this.codeMirrorOriginal_.scrollTo(0, scrollOriginal);

    var modifiedScrollInfo = this.codeMirrorModified_.getScrollInfo();

    if (offset.modifiedTo < modifiedScrollInfo.top) {
      var scrollModified = Tools.clamp(offset.modifiedFrom - GAP, 0, Infinity);
      this.codeMirrorModified_.scrollTo(0, scrollModified);
    }
  }

  this.checkMenu_();
};

/**
 * Checks index of currently selected offset and makes up/down buttons disabled
 * if needed.
 * @private
 */
DoubleEditorController.prototype.checkMenu_ = function () {
  this.menu_.setButtonUpEnabled(this.currentChange_ > 0);
  this.menu_.setButtonDownEnabled(
      this.currentChange_ < this.changes_.length - 1);
};

/**
 * @return {number}
 */
DoubleEditorController.prototype.getCurrentChange = function () {
  return this.currentChange_;
};

/**
 * @private
 */
DoubleEditorController.prototype.colorizeLines_ = function () {
  DoubleEditorController.cleanupEditor(this.codeMirrorOriginal_);
  DoubleEditorController.cleanupEditor(this.codeMirrorModified_);

  var lineOriginal = 0;
  var lineModified = 0;

  this.lines_.forEach(function (chunk, index) {
    var originalChunkSize = chunk.originalTo - chunk.originalFrom;
    var modifiedChunkSize = chunk.modifiedTo - chunk.modifiedFrom;

    if (chunk.type) {
      var nextChunkType = this.lines_[index + 1] ?
        this.lines_[index + 1].type :
        null;

      var usedLine;
      var lineClass;
      var i;

      i = chunk.originalFrom;
      do {
        usedLine = (originalChunkSize === 0) ? i - 1 : i;
        lineClass = DoubleEditorController.getLineClass(chunk.type,
          usedLine, chunk.originalFrom, chunk.originalTo, nextChunkType);

        DoubleEditorController.colorizeLine(this.codeMirrorOriginal_,
          usedLine, lineClass);
        DoubleEditorController.colorizeInline(this.codeMirrorOriginal_,
          chunk.original, lineOriginal);

        i++;
      } while (i < chunk.originalTo);

      i = chunk.modifiedFrom;
      do {
        usedLine = (modifiedChunkSize === 0) ? i - 1 : i;
        lineClass = DoubleEditorController.getLineClass(chunk.type,
          usedLine, chunk.modifiedFrom, chunk.modifiedTo, nextChunkType);

        DoubleEditorController.colorizeLine(this.codeMirrorModified_,
          usedLine, lineClass);
        DoubleEditorController.colorizeInline(this.codeMirrorModified_,
          chunk.modified, lineModified);
        i++;
      } while (i < chunk.modifiedTo);
    }

    lineOriginal += originalChunkSize;
    lineModified += modifiedChunkSize;
  }, this);

  cmHelper.executeOperationBuffer(this.codeMirrorOriginal_);
  cmHelper.executeOperationBuffer(this.codeMirrorModified_);
};

/**
 * Removes all classes from selected lines and removes all text selections.
 * @static
 * @param {CodeMirror} editor
 */
DoubleEditorController.cleanupEditor = function (editor) {
  // todo(igor.alexeenko): var cleanupBuffer = new CMOperationBuffer(editor);
  var lineHandleBuffer = cmHelper.getSelectionsBuffer(editor);

  lineHandleBuffer.forEach(function (lineHandle) {
    cmHelper.addOperation(editor, function () {
      editor.removeLineClass(lineHandle,
        DoubleEditorController.EDITOR_MODE);
    });
  });

  var textSelectionsBuffer = editor.getDoc().getAllMarks();
  textSelectionsBuffer.forEach(function (textSelection) {
    cmHelper.addOperation(editor, function () {
      textSelection.clear();
    });
  });

  cmHelper.cleanupSelections(editor);
  cmHelper.executeOperationBuffer(editor);
};

/**
 * Colorizes one line.
 * @static
 * @param {CodeMirror} editor
 * @param {number} usedLine
 * @param {string} lineClass
 */
DoubleEditorController.colorizeLine = function (editor, usedLine, lineClass) {
  cmHelper.addOperation(editor, function () {
    var lineHandle = editor.getLineHandle(usedLine);
    editor.addLineClass(lineHandle,
      DoubleEditorController.EDITOR_MODE, lineClass);

    cmHelper.addSelection(editor, lineHandle);
  });
};

/**
 * Returns list of line classes which should be added to line of given type.
 * @static
 * @param {Parser.LineType} type
 * @param {number} lineIndex
 * @param {number} from
 * @param {number} to
 * @param {Parser.LineType=} opt_nextType
 * @return {string}
 */
DoubleEditorController.getLineClass = function (type, lineIndex, from, to, opt_nextType) {
  var classes = [];

  /**
   * Array of types, which are used in detection of CSS class for th current line.
   * @type {Array.<Parser.LineType>}
   */
  var usedTypes = [
    Parser.LineType.NULL,
    Parser.LineType.ADDED,
    Parser.LineType.DELETED,
    Parser.LineType.INLINE
  ];

  /**
   * Lookup table of line types to CSS classes.
   * @type {Object.<Parser.LineType, string>}
   */
  var typeToLineClass = Tools.createObject(
    Parser.LineType.NULL, '',
    Parser.LineType.ADDED, DoubleEditorController.LineClass.ADDED,
    Parser.LineType.DELETED, DoubleEditorController.LineClass.DELETED,
    Parser.LineType.INLINE, DoubleEditorController.LineClass.MODIFIED,
      Parser.LineType.INLINE | Parser.LineType.ADDED,
    DoubleEditorController.LineClass.MODIFIED,
      Parser.LineType.INLINE | Parser.LineType.DELETED,
    DoubleEditorController.LineClass.MODIFIED);

  /**
   * Lookup table of line types to CSS classes, which are used for lines
   * before deleted or added line of code.
   * @type {Object.<Parser.LineType, string>}
   */
  var collapsedLineTypeToClass = Tools.createObject(
    Parser.LineType.ADDED,
    DoubleEditorController.LineClass.BEFORE_ADDED,
    Parser.LineType.DELETED,
    DoubleEditorController.LineClass.BEFORE_DELETED);

  var normalizedType = Parser.normalizeType(type, usedTypes);

  if (from === to) {
    classes.push(collapsedLineTypeToClass[normalizedType]);
  } else {
    classes.push(typeToLineClass[normalizedType]);

    if (lineIndex === from) {
      classes.push(DoubleEditorController.LineClass.FIRST);
    }

    if (lineIndex === to - 1 && !opt_nextType) {
      classes.push(DoubleEditorController.LineClass.LAST);
    }
  }

  return classes.join(' ');
};

/**
 * @param {CodeMirror} editor
 * @param {Array} inlineChunks
 * @param {number} lineOffset
 */
DoubleEditorController.colorizeInline = function (editor, inlineChunks, lineOffset) {
  var typeToInlineClass = Tools.createObject(
    Parser.LineType.ADDED, DoubleEditorController.CharsClass.ADDED,
    Parser.LineType.DELETED, DoubleEditorController.CharsClass.DELETED,
    Parser.LineType.INLINE, DoubleEditorController.CharsClass.MODIFIED,
    Parser.LineType.NULL, DoubleEditorController.CharsClass.UNCHANGED);

  inlineChunks.forEach(function (chunk) {
    if (chunk.type) {
      var className = typeToInlineClass[chunk.type];

      cmHelper.addOperation(editor, function () {
        editor.markText({
          line: chunk.from.line + lineOffset,
          ch: chunk.from['char']
        }, {
          line: chunk.to.line + lineOffset,
          ch: chunk.to['char']
        }, {
          className: className
        });
      });
    }
  });
};

/**
 * Draws changes map on a scrollbar.
 * @private
 */
DoubleEditorController.prototype.drawMap_ = function () {
  if (!this.mapElement_) {
    this.mapElement_ = this.element_.querySelector(
      DoubleEditorController.CssSelector.MAP);

    if (!this.mapElement_) {
      return;
    }
  }

  this.mapElement_.innerHTML = '';
  this.mapElements_ = [];

  var editor = this.getModifiedEditor();
  var documentSize = editor.getDoc().size;

  this.offsets_.forEach(function (offset, index) {
    var currentOffset = this.lines_[index];
    var mapElement = DoubleEditorController.getMapElement(currentOffset,
      documentSize);

    if (mapElement) {
      this.mapElements_.push(mapElement);
      this.mapElement_.appendChild(mapElement);
      $(mapElement).on('click', Tools.bindContext(this.onMapElementClick_, this));
    }
  }, this);
};

/**
 * @static
 * @param {Object} offset
 * @param {number} documentSize
 * @return {Element|null}
 */
DoubleEditorController.getMapElement = function (offset, documentSize) {
  var mapElement = null;

  var usedType = [
    Parser.LineType.ADDED,
    Parser.LineType.DELETED,
    Parser.LineType.INLINE
  ];

  /**
   * Lookup table of chunk types to classes.
   * @type {Object.<Parser.LineType, string>}
   */
  var typeToElementClass = Tools.createObject(
    Parser.LineType.ADDED, DoubleEditorController.MapClass.ADDED,
    Parser.LineType.DELETED, DoubleEditorController.MapClass.DELETED,
    Parser.LineType.INLINE, DoubleEditorController.MapClass.MODIFIED,
      Parser.LineType.INLINE | Parser.LineType.ADDED,
    DoubleEditorController.MapClass.MODIFIED,
      Parser.LineType.INLINE | Parser.LineType.DELETED,
    DoubleEditorController.MapClass.MODIFIED);

  var normalizedType = Parser.normalizeType(offset.type, usedType);

  if (normalizedType) {
    mapElement = document.createElement('div');
    mapElement.className = [
      DoubleEditorController.MapClass.ELEMENT_BASE,
      typeToElementClass[normalizedType]
    ].join(' ');

    var topOffset = Math.round(offset.modifiedFrom * 100 / documentSize);
    var bottomOffset = Math.round(offset.modifiedTo * 100 / documentSize);
    var height = Tools.clamp((bottomOffset - topOffset), 1, Infinity);

    mapElement.style.top = topOffset + '%';
    mapElement.style.height = height + '%';
  }

  return mapElement;
};

/**
 * @param {Event} event
 * @private
 */
DoubleEditorController.prototype.onMapElementClick_ = function (event) {
  var mapElement = event.currentTarget;
  var changeIndex = this.mapElements_.indexOf(mapElement);

  if (changeIndex > -1) {
    this.setCurrentChange(changeIndex, true);
  }
};

/**
 * @return {CodeMirror}
 */
DoubleEditorController.prototype.getModifiedEditor = function () {
  return this.codeMirrorModified_;
};

/* global global */
global.CodeMirror = global.CodeMirror || CodeMirror;
module.exports = DoubleEditorController;
