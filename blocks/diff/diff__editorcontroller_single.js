/* global CodeMirror: true */

/**
 * @fileoverview Controller for single-pane editor.
 * @author igor.alexeenko (Igor Alexeenko)
 */

define([
  'diff/diff__tools',
  'global/global__codemirror-helper',
  'diff/diff__editorcontroller',
  'diff/diff__parser_singlepane'
], function(d, CodeMirrorHelper) {
  'use strict';

  /**
   * @param {Element} element
   * @constructor
   * @extends {d.EditorController}
   */
  d.SingleEditorController = function(element) {
    d.SingleEditorController.super_.constructor.call(this, element,
        false, d.ParserSinglePane.getInstance());
  };
  d.inherit(d.SingleEditorController, d.EditorController);

  /**
   * @type {string}
   * @const
   */
  d.SingleEditorController.EDITOR_MODE = 'background';

  /**
   * {@link CodeMirror} gutters' IDs.
   * @enum {string}
   */
  d.SingleEditorController.Gutter = {
    ORIGINAL: 'cm-gutter-original',
    MODIFIED: 'cm-gutter-modified',
    SYMBOL: 'cm-gutter-symbol'
  };

  /**
   * Text markers for different types of lines.
   * @enum {string}
   */
  d.SingleEditorController.GutterSymbol = {
    ADDED: '+',
    DELETED: '-',
    INLINE: '*'
  };

  /**
   * ID of type of code for current chunk.
   * @enum {string}
   */
  d.SingleEditorController.CodeType = {
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
  d.SingleEditorController.InlineCodeType = {
    ADDED: 'added',
    DELETED: 'deleted',
    UNCHANGED: 'unchanged'
  };

  /**
   * @enum {string}
   */
  d.SingleEditorController.LineClass = {
    ADDED: 'cm-line-added',
    DELETED: 'cm-line-deleted',
    INLINE: 'cm-line-inline',
    INLINE_ADDED: 'cm-line-inline-added',
    INLINE_DELETED: 'cm-line-inline-deleted',
    UNCHANGED: ''
  };

  /**
   * @enum {string}
   */
  d.SingleEditorController.InlineClass = {
    ADDED: 'cm-inline-change-added',
    DELETED: 'cm-inline-change-deleted',
    UNCHANGED: 'cm-inline-change-unchanged',
    /** Reserve for future changes. */
    WHITESPACE: 'cm-inline-change-whitespace'
  };

  /**
   * @typedef {Array.<d.SingleEditorController.EditorContentChunk>}
   */
  d.SingleEditorController.EditorContent = [];

  /**
   * @typedef {{
   *   change: d.Parser.LineModification,
   *   codeType: d.SingleEditorController.CodeType,
   *   content: string?,
   *   rangeModified: d.Range,
   *   rangeOriginal: d.Range
   * }}
   */
  d.SingleEditorController.EditorContentChunk = {};

  /**
   * @override
   */
  d.SingleEditorController.prototype.setEnabledInternal = function(
      enabled) {
    if (!enabled) {
      this.element_.innerHTML = '';
    }
  };

  /**
   * Creates instance of {@link CodeMirror}, parses content into a buffer
   * for it, highlights its lines.
   * @override
   */
  d.SingleEditorController.prototype.setContentInternal = function(
      original, modified, diff) {
    var parsedContent = this.codeParser_.parse(original, modified, diff);

    if (!parsedContent) {
      return;
    }

    /**
     * @type {CodeMirror}
     * @private
     */
    this.editor_ = new CodeMirror(
        this.element_,
        d.SingleEditorController.getCodeMirrorOptions());

    var editorContent = d.SingleEditorController.getEditorContent(
        parsedContent);
    var editorText = d.SingleEditorController.getEditorContentText(
        editorContent);

    this.editor_.setValue(editorText);
    d.SingleEditorController.highlightLines(editorContent, this.editor_);
  };

  /**
   * Returns {@code d.SingleEditorController.EditorContent}, which represents
   * description for chunks of code in editor. Contains text, numbers of lines
   * in both original and modified code and type of line.
   * @param {Array.<d.Parser.LineModification>} parsedContent
   * @return {d.SingleEditorController.EditorContent}
   */
  d.SingleEditorController.getEditorContent = function(parsedContent) {
    var output = /** @type {d.SingleEditorController.EditorContent} */ ([]);
    var usedTypes = [
      d.Parser.LineType.NULL,
      d.Parser.LineType.ADDED,
      d.Parser.LineType.DELETED,
      d.Parser.LineType.INLINE
    ];

    var typeToContentGetter = d.createObject(
        d.Parser.LineType.NULL, d.SingleEditorController.contentGetter.nil,
        d.Parser.LineType.ADDED, d.SingleEditorController.contentGetter.added,
        d.Parser.LineType.ADDED | d.Parser.LineType.INLINE,
            d.SingleEditorController.contentGetter.addedInline,
        d.Parser.LineType.DELETED,
            d.SingleEditorController.contentGetter.deleted,
        d.Parser.LineType.DELETED | d.Parser.LineType.INLINE,
            d.SingleEditorController.contentGetter.deletedInline,
        d.Parser.LineType.INLINE,
            d.SingleEditorController.contentGetter.inline);

    var lineOriginal = 1,
        lineModified = 1;

    parsedContent.forEach(function(change, index, changes) {
      var normalizedType = d.Parser.normalizeType(change.type, usedTypes);
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
  d.SingleEditorController.contentGetter = {};

  /**
   * @typedef {function(
   *   type: d.Parser.LineType,
   *   change: d.Parser.LineModification,
   *   index: number,
   *   changes: Array.<d.Parser.LineModification>,
   *   output: d.SingleEditorController.EditorContent,
   *   lineOriginal: number,
   *   lineModified: number
   * ):d.SingleEditorController.EditorContent}
   */
  d.SingleEditorController.contentGetterFn = function() {};

  /**
   * Returns output buffer for unchanged code.
   * @type {d.SingleEditorController.contentGetterFn}
   */
  d.SingleEditorController.contentGetter.nil = function(type, change, index,
      changes, output, lineOriginal, lineModified) {

    /**
     * @type {number}
     * @const
     */
    var CONTEXT_SIZE = 3;
    var code = d.parsers.joinInlineContent(change.original);
    var codeLines = d.Parser.splitToLines(code);

    var beforeNext = codeLines.splice(-CONTEXT_SIZE);
    var afterPrevious = codeLines.splice(0, CONTEXT_SIZE);

    var codeType = d.SingleEditorController.CodeType.UNCHANGED;

    if (afterPrevious.length) {
      if (index !== 0) {
        output.push(d.SingleEditorController.getEditorContentChunk(
            change, codeType, afterPrevious.join(''),
            new d.Range(lineOriginal, lineOriginal + afterPrevious.length),
            new d.Range(lineModified, lineModified + afterPrevious.length)),
            d.SingleEditorController.getInlineContent(change, codeType));
      }

      lineOriginal += afterPrevious.length;
      lineModified += afterPrevious.length;
    }

    if (codeLines.length) {
      if (index !== 0 && index !== changes.length - 1) {
        output.push(d.SingleEditorController.getEditorContentChunk(
            change, d.SingleEditorController.CodeType.FOLDED,
            null,
            new d.Range(lineOriginal, lineModified + codeLines.length),
            new d.Range(lineModified, lineModified + codeLines.length)));
      }

      lineOriginal += codeLines.length;
      lineModified += codeLines.length;
    }

    if (beforeNext.length) {
      if (index !== changes.length - 1) {
        output.push(d.SingleEditorController.getEditorContentChunk(
            change, d.SingleEditorController.CodeType.UNCHANGED,
            beforeNext.join(''),
            new d.Range(lineOriginal, lineOriginal + beforeNext.length),
            new d.Range(lineModified, lineModified + beforeNext.length),
            d.SingleEditorController.getInlineContent(change, codeType)));
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
   * @type {d.SingleEditorController.contentGetterFn}
   */
  d.SingleEditorController.contentGetter.added = function(type, change, index,
      changes, output, lineOriginal, lineModified) {
    var code = d.parsers.joinInlineContent(change.modified);
    var linesNum = change.modifiedTo - change.modifiedFrom;

    var codeType = d.SingleEditorController.CodeType.ADDED;

    output.push(d.SingleEditorController.getEditorContentChunk(
        change, codeType, code, null,
        new d.Range(lineModified, lineModified + linesNum),
        d.SingleEditorController.getInlineContent(change, codeType)));

    return {
      lineOriginal: lineOriginal,
      lineModified: lineModified + linesNum
    };
  };

  /**
   * Returns output buffer for code, which was deleted.
   * @type {d.SingleEditorController.contentGetterFn}
   */
  d.SingleEditorController.contentGetter.deleted = function(type, change, index,
      changes, output, lineOriginal, lineModified) {
    var code = d.parsers.joinInlineContent(change.original);
    var linesNum = change.originalTo - change.originalFrom;

    var codeType = d.SingleEditorController.CodeType.DELETED;

    output.push(d.SingleEditorController.getEditorContentChunk(
        change, codeType, code,
        new d.Range(lineOriginal, lineOriginal + linesNum), null,
        d.SingleEditorController.getInlineContent(change, codeType)));

    return {
      lineOriginal: lineOriginal + linesNum,
      lineModified: lineModified
    };
  };

  /**
   * Returns output buffer for code with inline modifications.
   * @type {d.SingleEditorController.contentGetterFn}
   */
  d.SingleEditorController.contentGetter.inline = function(type, change, index,
      changes, output, lineOriginal, lineModified) {
    var original = d.parsers.joinInlineContent(change.original);
    var modified = d.parsers.joinInlineContent(change.modified);

    var linesOriginalNum = change.originalTo - change.originalFrom;
    var linesModifiedNum = change.modifiedTo - change.modifiedFrom;

    output.push(d.SingleEditorController.getEditorContentChunk(
        change, d.SingleEditorController.CodeType.DELETED_INLINE,
        original, new d.Range(lineOriginal, lineOriginal + linesOriginalNum),
        null, d.SingleEditorController.getInlineContent(change,
            d.SingleEditorController.CodeType.DELETED_INLINE)));

    output.push(d.SingleEditorController.getEditorContentChunk(
        change, d.SingleEditorController.CodeType.ADDED_INLINE,
        modified, null,
        new d.Range(lineModified, lineModified + linesModifiedNum),
        d.SingleEditorController.getInlineContent(change,
            d.SingleEditorController.CodeType.ADDED_INLINE)));

    return {
      lineOriginal: lineOriginal + linesOriginalNum,
      lineModified: lineModified + linesModifiedNum
    };
  };

  /**
   * Returns output buffer for code with inline modifications in case if all
   * this modifications are insertions.
   * @type {d.SingleEditorController.contentGetterFn}
   */
  d.SingleEditorController.contentGetter.addedInline = function(type, change,
      index, changes, output, lineOriginal, lineModified) {
    var code = d.parsers.joinInlineContent(change.modified);
    var linesOriginalNum = change.originalTo - change.originalFrom;
    var linesModifiedNum = change.modifiedTo - change.modifiedFrom;

    var codeType = d.SingleEditorController.CodeType.INLINE_INSERTIONS;

    output.push(d.SingleEditorController.getEditorContentChunk(
        change, codeType, code,
        new d.Range(lineOriginal, lineOriginal + linesOriginalNum),
        new d.Range(lineModified, lineModified + linesModifiedNum),
        d.SingleEditorController.getInlineContent(change, codeType)));

    return {
      lineOriginal: lineOriginal + linesOriginalNum,
      lineModified: lineModified + linesModifiedNum
    };
  };

  /**
   * Returns output buffer for code, which contains only inline deletions.
   * @type {d.SingleEditorController.contentGetterFn}
   */
  d.SingleEditorController.contentGetter.deletedInline = function(type, change,
      index, changes, output, lineOriginal, lineModified) {
    var code = d.parsers.joinInlineContent(change.original);
    var linesOriginalNum = change.originalTo - change.originalFrom;
    var linesModifiedNum = change.modifiedTo - change.modifiedFrom;

    var codeType = d.SingleEditorController.CodeType.INLINE_DELETIONS;

    output.push(d.SingleEditorController.getEditorContentChunk(
        change, codeType, code,
        new d.Range(lineOriginal, lineOriginal + linesOriginalNum),
        new d.Range(lineModified, lineModified + linesModifiedNum),
        d.SingleEditorController.getInlineContent(change, codeType)));

    return {
      lineOriginal: lineOriginal + linesOriginalNum,
      lineModified: lineModified + linesModifiedNum
    };
  };

  /**
   * @param {d.Parser.LineModification} change
   * @param {d.SingleEditorController.CodeType} codeType
   */
  d.SingleEditorController.getInlineContent = function(change, codeType) {
    var output = [];
    var codeTypeToInlineCodeType = d.createObject(
        d.SingleEditorController.CodeType.ADDED,
            d.SingleEditorController.InlineCodeType.ADDED,
        d.SingleEditorController.CodeType.ADDED_INLINE,
            d.SingleEditorController.InlineCodeType.ADDED,
        d.SingleEditorController.CodeType.INLINE_INSERTIONS,
            d.SingleEditorController.InlineCodeType.ADDED,
        d.SingleEditorController.CodeType.DELETED,
            d.SingleEditorController.InlineCodeType.DELETED,
        d.SingleEditorController.CodeType.DELETED_INLINE,
            d.SingleEditorController.InlineCodeType.DELETED,
        d.SingleEditorController.CodeType.INLINE_DELETIONS,
            d.SingleEditorController.InlineCodeType.DELETED,
        d.SingleEditorController.CodeType.UNCHANGED,
            d.SingleEditorController.InlineCodeType.UNCHANGED);

    var codeTypeToUsedChanges = d.createObject(
        d.SingleEditorController.CodeType.ADDED, change.modified,
        d.SingleEditorController.CodeType.ADDED_INLINE, change.modified,
        d.SingleEditorController.CodeType.INLINE_INSERTIONS, change.modified,
        d.SingleEditorController.CodeType.DELETED, change.original,
        d.SingleEditorController.CodeType.DELETED_INLINE, change.original,
        d.SingleEditorController.CodeType.INLINE_DELETIONS, change.original,
        d.SingleEditorController.CodeType.UNCHANGED, change.original);

    var usedChanges = codeTypeToUsedChanges[codeType];
    var usedType;

    usedChanges.forEach(function(inlineChange) {
      if (inlineChange.type === d.Parser.LineType.NULL) {
        usedType = d.SingleEditorController.InlineCodeType.UNCHANGED;
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
   * Wrapper to get {@code d.SingleEditorController.EditorContentChunk}.
   * @param {d.Parser.LineModification} change
   * @param {d.SingleEditorController.CodeType} codeType
   * @param {string?} content
   * @param {d.Range?} rangeOriginal
   * @param {d.Range?} rangeModified
   * @param {Object} inlineChange
   * @return {d.SingleEditorController.EditorContentChunk}
   */
  d.SingleEditorController.getEditorContentChunk = function(change, codeType,
      content, rangeOriginal, rangeModified, inlineChange) {
    return /** @type {d.SingleEditorController.EditorContentChunk} */ ({
      change: change,
      codeType: codeType,
      content: content,
      rangeModified: rangeModified,
      rangeOriginal: rangeOriginal,
      inlineChange: inlineChange
    });
  };

  /**
   * Returns concatenated lines to add into editor as string content.
   * @param {d.SingleEditorController.EditorContent} editorContent
   * @return {string}
   */
  d.SingleEditorController.getEditorContentText = function(editorContent) {
    var lines = editorContent.map(function(line) {
      return line.content;
    });

    return lines.join('');
  };

  /**
   * Highlights lines with separate background color, places line number
   * and gutter symbol if needed.
   * @param {d.SingleEditorController.EditorContent} editorContent
   * @param {CodeMirror} editor
   */
  d.SingleEditorController.highlightLines = function(editorContent, editor) {
    var cmHelper = CodeMirrorHelper.getInstance();

    var codeTypeToLineClass = d.createObject(
        d.SingleEditorController.CodeType.ADDED, 'added',
        d.SingleEditorController.CodeType.ADDED_INLINE, 'inline-added',
        d.SingleEditorController.CodeType.DELETED, 'deleted',
        d.SingleEditorController.CodeType.DELETED_INLINE, 'inline-deleted',
        d.SingleEditorController.CodeType.INLINE_INSERTIONS, 'inline',
        d.SingleEditorController.CodeType.INLINE_DELETIONS, 'inline',
        d.SingleEditorController.CodeType.UNCHANGED, '');

    var codeTypeToGutterSymbol = d.createObject(
        d.SingleEditorController.CodeType.ADDED,
            d.SingleEditorController.GutterSymbol.ADDED,
        d.SingleEditorController.CodeType.ADDED_INLINE,
            d.SingleEditorController.GutterSymbol.ADDED,
        d.SingleEditorController.CodeType.DELETED,
            d.SingleEditorController.GutterSymbol.DELETED,
        d.SingleEditorController.CodeType.DELETED_INLINE,
            d.SingleEditorController.GutterSymbol.DELETED,
        d.SingleEditorController.CodeType.INLINE_INSERTIONS,
            d.SingleEditorController.GutterSymbol.INLINE,
        d.SingleEditorController.CodeType.INLINE_DELETIONS,
            d.SingleEditorController.GutterSymbol.INLINE);

    var editorLine = 0;

    editorContent.forEach(function(chunk) {
      var lineClassName = codeTypeToLineClass[chunk.codeType];
      var lineGutterSymbol = codeTypeToGutterSymbol[chunk.codeType];

      var originalSize = 0,
          modifiedSize = 0;

      var chunkSize = 0;

      switch(chunk.codeType) {
      case d.SingleEditorController.CodeType.UNCHANGED:
      case d.SingleEditorController.CodeType.DELETED:
      case d.SingleEditorController.CodeType.DELETED_INLINE:
      case d.SingleEditorController.CodeType.INLINE_DELETIONS:
        originalSize = chunk.rangeOriginal.to - chunk.rangeOriginal.from;
        chunkSize += originalSize;
        break;

      case d.SingleEditorController.CodeType.ADDED:
      case d.SingleEditorController.CodeType.ADDED_INLINE:
      case d.SingleEditorController.CodeType.INLINE_INSERTIONS:
        modifiedSize = chunk.rangeModified.to - chunk.rangeModified.from;
        chunkSize += modifiedSize;
        break;
      }

      if (chunk.codeType !== d.SingleEditorController.CodeType.FOLDED) {
        for (var i = 0; i < chunkSize; i++, editorLine++) {
          d.SingleEditorController.highlightLine(editor, editorLine,
              lineClassName, lineGutterSymbol, i, chunk);
        }

        var inlineChangeTypeToClass = d.createObject(
            d.SingleEditorController.InlineCodeType.ADDED, 'inline-added',
            d.SingleEditorController.InlineCodeType.DELETED, 'inline-deleted',
            d.SingleEditorController.InlineCodeType.UNCHANGED, '');

        if (chunk.inlineChange) {
          var originalLineNumber = editorLine - chunkSize;

          chunk.inlineChange.forEach(function(inline) {
            cmHelper.addOperation(editor, function() {
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
        d.SingleEditorController.addFoldedLine(editor, editorLine);
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
   * @param {d.SingleEditorController.GutterSymbol} lineGutterSymbol
   * @param {number} i
   * @param {d.Parser.LineModification} chunk
   */
  d.SingleEditorController.highlightLine = function(editor, editorLine,
      lineClassName, lineGutterSymbol, i, chunk) {
    var cmHelper = CodeMirrorHelper.getInstance();

    cmHelper.addOperation(editor, function() {
      editor.addLineClass(editorLine,
          d.SingleEditorController.EDITOR_MODE, lineClassName);
    });

    if (lineGutterSymbol) {
      cmHelper.addOperation(editor, function() {
        editor.setGutterMarker(editorLine,
            d.SingleEditorController.Gutter.SYMBOL,
            document.createTextNode(lineGutterSymbol));
      });
    }

    if (chunk.rangeOriginal) {
      cmHelper.addOperation(editor, function() {
        editor.setGutterMarker(editorLine,
            d.SingleEditorController.Gutter.ORIGINAL,
            document.createTextNode(chunk.rangeOriginal.from + i));
      });
    }

    if (chunk.rangeModified) {
      cmHelper.addOperation(editor, function() {
        editor.setGutterMarker(editorLine,
            d.SingleEditorController.Gutter.MODIFIED,
            document.createTextNode(chunk.rangeModified.from + i));
      });
    }
  };

  /**
   * Inserts line widget for folded line.
   * @param {CodeMirror} editor
   * @param {number} editorLine
   */
  d.SingleEditorController.addFoldedLine = function(editor, editorLine) {
    var cmHelper = CodeMirrorHelper.getInstance();

    var foldedLineElement = document.createElement('div');
    foldedLineElement.className = 'folded';

    cmHelper.addOperation(editor, function() {
      editor.addLineWidget(editorLine - 1, foldedLineElement,
          d.SingleEditorController.getCodeMirrorOptions());
    });
  };

  /**
   * Returns {@code Object}, which represents options for instance
   * of {@link CodeMirror}.
   * @return {Object}
   */
  d.SingleEditorController.getCodeMirrorOptions = function() {
    return {
      gutters: [
        d.SingleEditorController.Gutter.ORIGINAL,
        d.SingleEditorController.Gutter.MODIFIED,
        d.SingleEditorController.Gutter.SYMBOL
      ],
      lineNumbers: false,
      readOnly: true
    };
  };

  /**
   * @static
   * @return {Object}
   */
  d.SingleEditorController.getFoldedLineOptions = function() {
    return {
      coverGutter: true,
      handleMouseEvents: false,
      noHScroll: true
    };
  };

  return d.SingleEditorController;
});
