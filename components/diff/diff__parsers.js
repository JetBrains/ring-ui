var Tools = require('./diff__tools');
var Parser = require('./__parser/diff__parser');

/**
 * Namespace for parser functions.
 */
var parsers = {};

/**
 * Parser. Takes information about chunk and information about change and
 * returns modified information about chunk.
 * @typedef {function(Parser.OutputLine, Parser.LineModification):Parser.OutputLine}
 */
parsers.parserFn = null;

/**
 * Returns the same result it takes.
 * @type {parsers.parserFn}
 */
parsers.nullParser = function (chunk) {
  return chunk;
};

/**
 * Analyzes inline changes of chunk. Chunk is treated as 'inline' if its
 * description contains inline changes or numbers of old lines and new lines
 * are not equal (rare case).
 * @type {parsers.parserFn}
 */
parsers.inlineChanges = function (chunk, change) {
  if (change.type === Parser.ModificationType.MODIFIED &&
    parsers.joinInlineContent(chunk.original) !==
    parsers.joinInlineContent(chunk.modified) &&
    change.oldLines > 0 && change.newLines > 0) {
    var insertions = 0;
    var deletions = 0;

    this.enableLineType(chunk, Parser.LineType.INLINE, true);

    if (Tools.isDef(change.ranges)) {
      var length = change.ranges.length;
      for (var i = 0; i < length; i += 1) {
        var currentRange = change.ranges[i];
        var changeOriginal = chunk.original[i];
        var changeModified = chunk.modified[i];

        if (currentRange.oldChars && currentRange.newChars) {
          this.enableLineType(changeOriginal, Parser.LineType.INLINE, true);
          this.enableLineType(changeModified, Parser.LineType.INLINE, true);
        }

        if (currentRange.oldChars && !currentRange.newChars) {
          deletions += 1;
          this.enableLineType(changeOriginal, Parser.LineType.DELETED, true);
          this.enableLineType(changeModified, Parser.LineType.DELETED, true);
        }

        if (currentRange.newChars && !currentRange.oldChars) {
          insertions += 1;
          this.enableLineType(changeOriginal, Parser.LineType.ADDED, true);
          this.enableLineType(changeModified, Parser.LineType.ADDED, true);
        }
      }
    } else if (change.type) {
      // todo(igor.alexeenko): Temporary measure.
      this.enableLineType(chunk.original[0], Parser.LineType.INLINE, true);
      this.enableLineType(chunk.modified[0], Parser.LineType.INLINE, true);
    }

    this.enableLineType(chunk, Parser.LineType.ADDED,
        insertions && !deletions);
    this.enableLineType(chunk, Parser.LineType.DELETED,
        deletions && !insertions);
  }

  return chunk;
};

/**
 * Checks if chunk was deleted from original code or added in modified.
 * @type {parsers.parserFn}
 */
parsers.addedOrDeleted = function (chunk, change) {
  var isAdded = change.newLines && !change.oldLines;
  var isDeleted = change.oldLines && !change.newLines;

  if (isAdded) {
    this.enableLineType(chunk, Parser.LineType.ADDED, isAdded);
    this.enableLineType(chunk.original[0], Parser.LineType.ADDED, isAdded);
    this.enableLineType(chunk.modified[0], Parser.LineType.ADDED, isAdded);
  }

  if (isDeleted) {
    this.enableLineType(chunk, Parser.LineType.DELETED, isDeleted);
    this.enableLineType(chunk.original[0], Parser.LineType.DELETED,
      isDeleted);
    this.enableLineType(chunk.modified[0], Parser.LineType.DELETED,
      isDeleted);
  }

  return chunk;
};

/**
 * Checks, if end-of-line symbols were changed.
 * @type {parsers.parserFn}
 */
parsers.EOLChanged = function (chunk, change) {
  if (change.ranges) {
    var joinOriginal = parsers.joinInlineContent(chunk.original);
    var joinModified = parsers.joinInlineContent(chunk.modified);

    var originalEOLs = joinOriginal.match(Tools.EOLRegex.ALL);
    var modifiedEOLs = joinModified.match(Tools.EOLRegex.ALL);

    var EOLChanged = originalEOLs && modifiedEOLs && !Tools.arraysAreEqual(originalEOLs, modifiedEOLs);

    if (EOLChanged) {
      this.enableLineType(chunk, Parser.LineType.EOL_CHANGED, true);
    }
  }

  return chunk;
};

/**
 * Returns string contents of {@link Parser.OutputLineContent}.
 * @param {Parser.OutputLineContent} lines
 * @return {string}
 */
parsers.joinInlineContent = function (lines) {
  var lineContent = '';

  lines.forEach(function (line) {
    lineContent += line.code;
  });

  return lineContent;
};

module.exports = parsers;
