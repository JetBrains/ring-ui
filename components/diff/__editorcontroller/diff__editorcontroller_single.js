/* eslint-disable no-bitwise */
/**
 * @fileoverview Controller for single-pane editor.
 * @author igor.alexeenko (Igor Alexeenko)
 */

var Tools = require('../diff__tools');
var EditorController = require('./diff__editorcontroller');
var Parser = require('../__parser/diff__parser');
var parsers = require('../diff__parsers');
var SinglePaneParser = require('../__parser/diff__parser_singlepane');
var CodeMirror = require('codemirror');
var cmHelper = require('../diff__code-mirror-helper');
var $ = require('jquery');

/**
 * @param {Element} element
 * @constructor
 * @extends {EditorController}
 */
var SingleEditorController = function (element) {
  SingleEditorController.super_.constructor.call(this, element, new SinglePaneParser());
};
Tools.inherit(SingleEditorController, EditorController);

/**
 * @type {string}
 * @const
 */
SingleEditorController.EDITOR_MODE = 'wrap';

/**
 * {@link CodeMirror} gutters' IDs.
 * @enum {string}
 */
SingleEditorController.Gutter = {
  ORIGINAL: 'ring-diff__gutter_original',
  MODIFIED: 'ring-diff__gutter_modified',
  SYMBOL: 'ring-diff__gutter-symbol'
};

/**
 * Text markers for different types of lines.
 * @enum {string}
 */
SingleEditorController.GutterSymbol = {
  ADDED: '+',
  DELETED: '-',
  INLINE: '*'
};

/**
 * ID of type of code for current chunk.
 * @enum {string}
 */
SingleEditorController.CodeType = {
  ADDED: 'added',
  ADDED_INLINE: 'added-inline',
  DELETED: 'deleted',
  DELETED_INLINE: 'deleted-inline',
  FOLDED: 'folded',
  INLINE_DELETIONS: 'inline-deletions',
  INLINE_INSERTIONS: 'inline-insertions',
  UNCHANGED: 'unchanged'
};

/**
 * @enum {string}
 */
SingleEditorController.InlineCodeType = {
  ADDED: 'added',
  DELETED: 'deleted',
  UNCHANGED: 'unchanged'
};

/**
 * @enum {string}
 */
SingleEditorController.ClassName = {
  BASE: 'ring-diff',
  MODIFIED: 'ring-diff_single'
};

/**
 * @enum {string}
 */
SingleEditorController.LineClass = {
  ADDED: 'ring-diff__line_added',
  ADDED_INLINE: 'ring-diff__line_added-inline',
  DELETED: 'ring-diff__line_deleted',
  DELETED_INLINE: 'ring-diff__line_deleted-inline',
  FOLDED: 'ring-diff__line_folded',
  INLINE: 'ring-diff__line_inline',
  UNCHANGED: ''
};

/**
 * @enum {string}
 */
SingleEditorController.InlineClass = {
  ADDED: 'ring-diff__change_added',
  DELETED: 'ring-diff__change_deleted',
  UNCHANGED: '',
  /**
   * Reserve for future changes.
   */
  WHITESPACE: 'ring-diff__change_whitespace'
};

/**
 * @typedef {Array.<SingleEditorController.EditorContentChunk>}
 */
SingleEditorController.EditorContent = [];

/**
 * @constructor
 */
SingleEditorController.EditorContentChunk = function (change, codeType, content, rangeOriginal, rangeModified, inlineChange) {
  this.change = change;
  this.codeType = codeType;
  this.content = content;
  this.rangeModified = rangeModified;
  this.rangeOriginal = rangeOriginal;
  this.inlineChange = inlineChange;
};

/**
 * @override
 */
SingleEditorController.prototype.setEnabledInternal = function (enabled) {
  if (!enabled) {
    this.getElement().innerHTML = '';
  }

  var editorClass = [
    SingleEditorController.ClassName.BASE,
    SingleEditorController.ClassName.MODIFIED
  ].join(' ');

  $(this.getElement()).toggleClass(editorClass, enabled);
};

/**
 * Creates instance of {@link CodeMirror}, parses content into a buffer
 * for it, highlights its lines.
 * @override
 */
SingleEditorController.prototype.setContentInternal = function (original, modified, diff) {
  var parsedContent = this.codeParser_.parse(original, modified, diff);

  if (!parsedContent) {
    return;
  }

  /**
   * @type {CodeMirror}
   * @private
   */
  this.editor_ = this.editor_ || new CodeMirror(
    this.getElement(),
    SingleEditorController.getCodeMirrorOptions());

  var editorContent = SingleEditorController.getEditorContent(parsedContent);
  var editorText = SingleEditorController.getEditorContentText(editorContent);

  this.editor_.setValue(editorText);
  SingleEditorController.highlightLines(editorContent, this.editor_);
};

/**
 * Returns {@code SingleEditorController.EditorContent}, which represents
 * description for chunks of code in the editor. Contains text and line numbers
 * in both original and modified code, as well as type of line.
 * @param {Array.<Parser.OutputLine>} parsedContent
 * @return {SingleEditorController.EditorContent}
 */
SingleEditorController.getEditorContent = function (parsedContent) {
  var output = /** @type {SingleEditorController.EditorContent} */ ([]);
  var usedTypes = [
    Parser.LineType.NULL,
    Parser.LineType.ADDED,
    Parser.LineType.DELETED,
    Parser.LineType.INLINE
  ];

  var typeToContentGetter = Tools.createObject(
    Parser.LineType.NULL, SingleEditorController.contentGetter.nil,
    Parser.LineType.ADDED, SingleEditorController.contentGetter.added,
      Parser.LineType.ADDED | Parser.LineType.INLINE,
    SingleEditorController.contentGetter.addedInline,
    Parser.LineType.DELETED,
    SingleEditorController.contentGetter.deleted,
      Parser.LineType.DELETED | Parser.LineType.INLINE,
    SingleEditorController.contentGetter.deletedInline,
    Parser.LineType.INLINE,
    SingleEditorController.contentGetter.inline);

  var lineOriginal = 1;
  var lineModified = 1;

  parsedContent.forEach(function (change, index, changes) {
    var normalizedType = Parser.normalizeType(change.type, usedTypes);
    var contentGetter = typeToContentGetter[normalizedType];

    // todo(igor.alexeenko): Get rid of side-effects.
    var linesOffset = contentGetter.call(null, normalizedType, change, index,
      changes, output, lineOriginal, lineModified);
    lineOriginal = linesOffset.lineOriginal;
    lineModified = linesOffset.lineModified;
  });

  return output;
};

/**
 * Namespace for methods, which gets output for content of different type.
 */
SingleEditorController.contentGetter = {};

/**
 * @typedef {function(
   *   type: Parser.LineType,
   *   change: Parser.LineModification,
   *   index: number,
   *   changes: Array.<Parser.LineModification>,
   *   output: SingleEditorController.EditorContent,
   *   lineOriginal: number,
   *   lineModified: number
   * ):SingleEditorController.EditorContent}
 */
SingleEditorController.contentGetterFn = function () {
};

/**
 * Returns output buffer for unchanged code.
 * @type {SingleEditorController.contentGetterFn}
 */
SingleEditorController.contentGetter.nil = function (type, change, index, changes, output, lineOriginal, lineModified) {

  /**
   * @type {number}
   * @const
   */
  var CONTEXT_SIZE = 3;
  var code = parsers.joinInlineContent(change.original);
  var codeLines = Parser.splitToLines(code);

  var beforeNext = codeLines.splice(-CONTEXT_SIZE);
  var afterPrevious = codeLines.splice(0, CONTEXT_SIZE);

  var codeType = SingleEditorController.CodeType.UNCHANGED;

  if (afterPrevious.length) {
    if (index !== 0) {
      output.push(SingleEditorController.getEditorContentChunk(
          change, codeType, afterPrevious.join(''),
          new Tools.Range(lineOriginal, lineOriginal + afterPrevious.length),
          new Tools.Range(lineModified, lineModified + afterPrevious.length)),
        SingleEditorController.getInlineContent(change, codeType));
    }

    lineOriginal += afterPrevious.length;
    lineModified += afterPrevious.length;
  }

  if (codeLines.length) {
    if (index !== 0 && index !== changes.length - 1) {
      output.push(SingleEditorController.getEditorContentChunk(
        change, SingleEditorController.CodeType.FOLDED,
        null,
        new Tools.Range(lineOriginal, lineModified + codeLines.length),
        new Tools.Range(lineModified, lineModified + codeLines.length)));
    }

    lineOriginal += codeLines.length;
    lineModified += codeLines.length;
  }

  if (beforeNext.length) {
    if (index !== changes.length - 1) {
      output.push(SingleEditorController.getEditorContentChunk(
        change, SingleEditorController.CodeType.UNCHANGED,
        beforeNext.join(''),
        new Tools.Range(lineOriginal, lineOriginal + beforeNext.length),
        new Tools.Range(lineModified, lineModified + beforeNext.length),
        SingleEditorController.getInlineContent(change, codeType)));
    }

    lineOriginal += beforeNext.length;
    lineModified += beforeNext.length;
  }

  return {
    lineOriginal: lineOriginal,
    lineModified: lineModified
  };
};

/**
 * Returns output buffer for new code.
 * @type {SingleEditorController.contentGetterFn}
 */
SingleEditorController.contentGetter.added = function (type, change, index, changes, output, lineOriginal, lineModified) {
  var code = parsers.joinInlineContent(change.modified);
  var linesNum = change.modifiedTo - change.modifiedFrom;

  var codeType = SingleEditorController.CodeType.ADDED;

  output.push(SingleEditorController.getEditorContentChunk(
    change, codeType, code, null,
    new Tools.Range(lineModified, lineModified + linesNum),
    SingleEditorController.getInlineContent(change, codeType)));

  return {
    lineOriginal: lineOriginal,
    lineModified: lineModified + linesNum
  };
};

/**
 * Returns output buffer for code, which was deleted.
 * @type {SingleEditorController.contentGetterFn}
 */
SingleEditorController.contentGetter.deleted = function (type, change, index, changes, output, lineOriginal, lineModified) {
  var code = parsers.joinInlineContent(change.original);
  var linesNum = change.originalTo - change.originalFrom;

  var codeType = SingleEditorController.CodeType.DELETED;

  output.push(SingleEditorController.getEditorContentChunk(
    change, codeType, code,
    new Tools.Range(lineOriginal, lineOriginal + linesNum), null,
    SingleEditorController.getInlineContent(change, codeType)));

  return {
    lineOriginal: lineOriginal + linesNum,
    lineModified: lineModified
  };
};

/**
 * Returns output buffer for code with inline modifications.
 * @type {SingleEditorController.contentGetterFn}
 */
SingleEditorController.contentGetter.inline = function (type, change, index, changes, output, lineOriginal, lineModified) {
  var original = parsers.joinInlineContent(change.original);
  var modified = parsers.joinInlineContent(change.modified);

  var linesOriginalNum = change.originalTo - change.originalFrom;
  var linesModifiedNum = change.modifiedTo - change.modifiedFrom;

  output.push(SingleEditorController.getEditorContentChunk(
    change, SingleEditorController.CodeType.DELETED_INLINE,
    original, new Tools.Range(lineOriginal, lineOriginal + linesOriginalNum),
    null, SingleEditorController.getInlineContent(change,
      SingleEditorController.CodeType.DELETED_INLINE)));

  output.push(SingleEditorController.getEditorContentChunk(
    change, SingleEditorController.CodeType.ADDED_INLINE,
    modified, null,
    new Tools.Range(lineModified, lineModified + linesModifiedNum),
    SingleEditorController.getInlineContent(change,
      SingleEditorController.CodeType.ADDED_INLINE)));

  return {
    lineOriginal: lineOriginal + linesOriginalNum,
    lineModified: lineModified + linesModifiedNum
  };
};

/**
 * Returns output buffer for code with inline modifications in case if all
 * modifications are insertions.
 * @type {SingleEditorController.contentGetterFn}
 */
SingleEditorController.contentGetter.addedInline = function (type, change, index, changes, output, lineOriginal, lineModified) {
  var code = parsers.joinInlineContent(change.modified);
  var linesOriginalNum = change.originalTo - change.originalFrom;
  var linesModifiedNum = change.modifiedTo - change.modifiedFrom;

  var codeType = SingleEditorController.CodeType.INLINE_INSERTIONS;

  output.push(SingleEditorController.getEditorContentChunk(
    change, codeType, code,
    new Tools.Range(lineOriginal, lineOriginal + linesOriginalNum),
    new Tools.Range(lineModified, lineModified + linesModifiedNum),
    SingleEditorController.getInlineContent(change, codeType)));

  return {
    lineOriginal: lineOriginal + linesOriginalNum,
    lineModified: lineModified + linesModifiedNum
  };
};

/**
 * Returns output buffer for code, which contains only inline deletions.
 * @type {SingleEditorController.contentGetterFn}
 */
SingleEditorController.contentGetter.deletedInline = function (type, change, index, changes, output, lineOriginal, lineModified) {
  var code = parsers.joinInlineContent(change.original);
  var linesOriginalNum = change.originalTo - change.originalFrom;
  var linesModifiedNum = change.modifiedTo - change.modifiedFrom;

  var codeType = SingleEditorController.CodeType.INLINE_DELETIONS;

  output.push(SingleEditorController.getEditorContentChunk(
    change, codeType, code,
    new Tools.Range(lineOriginal, lineOriginal + linesOriginalNum),
    new Tools.Range(lineModified, lineModified + linesModifiedNum),
    SingleEditorController.getInlineContent(change, codeType)));

  return {
    lineOriginal: lineOriginal + linesOriginalNum,
    lineModified: lineModified + linesModifiedNum
  };
};

/**
 * @param {SingleEditorController.contentGetterFn} change
 * @param {SingleEditorController.CodeType} codeType
 */
SingleEditorController.getInlineContent = function (change, codeType) {
  var output = [];
  var codeTypeToInlineCodeType = Tools.createObject(
    SingleEditorController.CodeType.ADDED,
    SingleEditorController.InlineCodeType.ADDED,
    SingleEditorController.CodeType.ADDED_INLINE,
    SingleEditorController.InlineCodeType.ADDED,
    SingleEditorController.CodeType.INLINE_INSERTIONS,
    SingleEditorController.InlineCodeType.ADDED,
    SingleEditorController.CodeType.DELETED,
    SingleEditorController.InlineCodeType.DELETED,
    SingleEditorController.CodeType.DELETED_INLINE,
    SingleEditorController.InlineCodeType.DELETED,
    SingleEditorController.CodeType.INLINE_DELETIONS,
    SingleEditorController.InlineCodeType.DELETED,
    SingleEditorController.CodeType.UNCHANGED,
    SingleEditorController.InlineCodeType.UNCHANGED);

  var codeTypeToUsedChanges = Tools.createObject(
    SingleEditorController.CodeType.ADDED, change.modified,
    SingleEditorController.CodeType.ADDED_INLINE, change.modified,
    SingleEditorController.CodeType.INLINE_INSERTIONS, change.modified,
    SingleEditorController.CodeType.DELETED, change.original,
    SingleEditorController.CodeType.DELETED_INLINE, change.original,
    SingleEditorController.CodeType.INLINE_DELETIONS, change.original,
    SingleEditorController.CodeType.UNCHANGED, change.original);

  var usedChanges = codeTypeToUsedChanges[codeType];
  var usedType;

  usedChanges.forEach(function (inlineChange) {
    if (inlineChange.type === Parser.LineType.NULL) {
      usedType = SingleEditorController.InlineCodeType.UNCHANGED;
    } else {
      usedType = codeTypeToInlineCodeType[codeType];
    }

    output.push({
      change: inlineChange,
      from: inlineChange.from,
      to: inlineChange.to,
      type: usedType
    });
  });

  return output;
};

/**
 * Wrapper to get {@code SingleEditorController.EditorContentChunk}.
 * @param {Parser.LineModification} change
 * @param {SingleEditorController.CodeType} codeType
 * @param {string?} content
 * @param {Tools.Range?} rangeOriginal
 * @param {Tools.Range} rangeModified
 * @param {Object} inlineChange
 * @return {SingleEditorController.EditorContentChunk}
 */
SingleEditorController.getEditorContentChunk = function (change, codeType, content, rangeOriginal, rangeModified, inlineChange) {
  return new SingleEditorController.EditorContentChunk(change, codeType, content, rangeOriginal, rangeModified, inlineChange);
};

/**
 * Returns concatenated lines to add into editor as string content.
 * @param {SingleEditorController.EditorContent} editorContent
 * @return {string}
 */
SingleEditorController.getEditorContentText = function (editorContent) {
  var lines = editorContent.map(function (line) {
    return line.content;
  });

  return lines.join('');
};

/**
 * Highlights lines with separate background color, places line number
 * and gutter symbol if needed.
 * @param {SingleEditorController.EditorContent} editorContent
 * @param {CodeMirror} editor
 */
SingleEditorController.highlightLines = function (editorContent, editor) {
  var codeTypeToLineClass = Tools.createObject(
    SingleEditorController.CodeType.ADDED,
    SingleEditorController.LineClass.ADDED,
    SingleEditorController.CodeType.ADDED_INLINE,
    SingleEditorController.LineClass.ADDED_INLINE,
    SingleEditorController.CodeType.DELETED,
    SingleEditorController.LineClass.DELETED,
    SingleEditorController.CodeType.DELETED_INLINE,
    SingleEditorController.LineClass.DELETED_INLINE,
    SingleEditorController.CodeType.INLINE_INSERTIONS,
    SingleEditorController.LineClass.INLINE,
    SingleEditorController.CodeType.INLINE_DELETIONS,
    SingleEditorController.LineClass.INLINE,
    SingleEditorController.CodeType.UNCHANGED,
    SingleEditorController.LineClass.UNCHANGED);

  var codeTypeToGutterSymbol = Tools.createObject(
    SingleEditorController.CodeType.ADDED,
    SingleEditorController.GutterSymbol.ADDED,
    SingleEditorController.CodeType.ADDED_INLINE,
    SingleEditorController.GutterSymbol.ADDED,
    SingleEditorController.CodeType.DELETED,
    SingleEditorController.GutterSymbol.DELETED,
    SingleEditorController.CodeType.DELETED_INLINE,
    SingleEditorController.GutterSymbol.DELETED,
    SingleEditorController.CodeType.INLINE_INSERTIONS,
    SingleEditorController.GutterSymbol.INLINE,
    SingleEditorController.CodeType.INLINE_DELETIONS,
    SingleEditorController.GutterSymbol.INLINE);

  var editorLine = 0;

  editorContent.forEach(function (chunk) {
    var lineClassName = codeTypeToLineClass[chunk.codeType];
    var lineGutterSymbol = codeTypeToGutterSymbol[chunk.codeType];

    var originalSize = 0;
    var modifiedSize = 0;

    var chunkSize = 0;

    switch (chunk.codeType) {
      case SingleEditorController.CodeType.UNCHANGED:
      case SingleEditorController.CodeType.DELETED:
      case SingleEditorController.CodeType.DELETED_INLINE:
      case SingleEditorController.CodeType.INLINE_DELETIONS:
        originalSize = chunk.rangeOriginal.to - chunk.rangeOriginal.from;
        chunkSize += originalSize;
        break;

      case SingleEditorController.CodeType.ADDED:
      case SingleEditorController.CodeType.ADDED_INLINE:
      case SingleEditorController.CodeType.INLINE_INSERTIONS:
        modifiedSize = chunk.rangeModified.to - chunk.rangeModified.from;
        chunkSize += modifiedSize;
        break;
    }

    if (chunk.codeType !== SingleEditorController.CodeType.FOLDED) {
      for (var i = 0; i < chunkSize; i++) {
        SingleEditorController.highlightLine(editor, editorLine,
          lineClassName, lineGutterSymbol, i, chunk);

        editorLine++;
      }

      var inlineChangeTypeToClass = Tools.createObject(
        SingleEditorController.InlineCodeType.ADDED,
        SingleEditorController.InlineClass.ADDED,
        SingleEditorController.InlineCodeType.DELETED,
        SingleEditorController.InlineClass.DELETED,
        SingleEditorController.InlineCodeType.UNCHANGED,
        SingleEditorController.InlineClass.UNCHANGED);

      if (chunk.inlineChange) {
        var originalLineNumber = editorLine - chunkSize;

        chunk.inlineChange.forEach(function (inline) {
          cmHelper.addOperation(editor, function () {
            editor.markText({
              line: inline.from.line + originalLineNumber,
              ch: inline.from['char']
            }, {
              line: inline.to.line + originalLineNumber,
              ch: inline.to['char']
            }, {
              className: inlineChangeTypeToClass[inline.type]
            });
          });
        });
      }

    } else {
      SingleEditorController.addFoldedLine(editor, editorLine);
    }
  });

  cmHelper.executeOperationBuffer(editor);
};

/**
 * Highlights one line.
 * @static
 * @param {CodeMirror} editor
 * @param {number} editorLine
 * @param {string} lineClassName
 * @param {SingleEditorController.GutterSymbol} lineGutterSymbol
 * @param {number} i
 * @param {Parser.LineModification} chunk
 */
SingleEditorController.highlightLine = function (editor, editorLine, lineClassName, lineGutterSymbol, i, chunk) {
  cmHelper.addOperation(editor, function () {
    editor.addLineClass(editorLine,
      SingleEditorController.EDITOR_MODE, lineClassName);
  });

  if (lineGutterSymbol) {
    cmHelper.addOperation(editor, function () {
      editor.setGutterMarker(editorLine,
        SingleEditorController.Gutter.SYMBOL,
        document.createTextNode(lineGutterSymbol));
    });
  }

  if (chunk.rangeOriginal) {
    cmHelper.addOperation(editor, function () {
      editor.setGutterMarker(editorLine,
        SingleEditorController.Gutter.ORIGINAL,
        document.createTextNode(chunk.rangeOriginal.from + i));
    });
  }

  if (chunk.rangeModified) {
    cmHelper.addOperation(editor, function () {
      editor.setGutterMarker(editorLine,
        SingleEditorController.Gutter.MODIFIED,
        document.createTextNode(chunk.rangeModified.from + i));
    });
  }
};

/**
 * Inserts line widget for folded line.
 * @param {CodeMirror} editor
 * @param {number} editorLine
 */
SingleEditorController.addFoldedLine = function (editor, editorLine) {
  var foldedLineElement = document.createElement('div');
  foldedLineElement.className = SingleEditorController.LineClass.FOLDED;

  cmHelper.addOperation(editor, function () {
    editor.addLineWidget(editorLine - 1, foldedLineElement,
      SingleEditorController.getCodeMirrorOptions());
  });
};

/**
 * Returns an editor properties object.
 * @return {Object}
 */
SingleEditorController.getCodeMirrorOptions = function () {
  return {
    gutters: [
      SingleEditorController.Gutter.ORIGINAL,
      SingleEditorController.Gutter.MODIFIED,
      SingleEditorController.Gutter.SYMBOL
    ],
    lineNumbers: false,
    readOnly: true
  };
};

/**
 * @static
 * @return {Object}
 */
SingleEditorController.getFoldedLineOptions = function () {
  return {
    coverGutter: true,
    handleMouseEvents: false,
    noHScroll: true
  };
};

/**
 * @return {CodeMirror}
 */
SingleEditorController.prototype.getEditor = function () {
  return this.editor_;
};

/* global global */
global.CodeMirror = global.CodeMirror || CodeMirror;
module.exports = SingleEditorController;
