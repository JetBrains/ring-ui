/**
 * @fileoverview
 * @author igor.alexeenko (Igor Alekseyenko)
 */
 
define([
  'diff/diff__tools'
], function(d) {
  /**
   * Namespace for parser functions.
   */
  d.parsers = {};

  /**
   * Parser. Takes information about chunk and information about change and
   * returns modified information about chunk.
   * @typedef {function(diffTool.Parser: d.Parser.OutputLine,
   *     diffTool.Parser.LineModification):d.Parser.OutputLine}
   */
  d.parsers.parserFn = null;

  /**
   * Returns the same result it takes.
   * @type {d.parsers.parserFn}
   */
  d.parsers.nullParser = function(chunk) {
    return chunk;
  };

  /**
   * Analyzes inline changes of chunk. Chunk treated as changed inline if its
   * description contains inline changes or numbers of old lines and new lines
   * are not equal (rare case).
   * @type {d.parsers.parserFn}
   */
  d.parsers.inlineChanges = function(chunk, change) {
    if (change.type === d.Parser.ModificationType.MODIFIED &&
        d.parsers.joinInlineContent(chunk.original) !==
            d.parsers.joinInlineContent(chunk.modified) &&
        change.oldLines > 0 && change.newLines > 0) {
      var insertions = 0,
          deletions = 0;

      this.enableLineType(chunk, d.Parser.LineType.INLINE, true);

      if (d.isDef(change.ranges)) {
        for (var i = 0, l = change.ranges.length; i < l; i++) {
          var currentRange = change.ranges[i];
          var changeOriginal = chunk.original[i];
          var changeModified = chunk.modified[i];

          if (currentRange.oldChars && currentRange.newChars) {
            this.enableLineType(changeOriginal, d.Parser.LineType.INLINE, true);
            this.enableLineType(changeModified, d.Parser.LineType.INLINE, true);
          }

          if (currentRange.oldChars && !currentRange.newChars) {
            deletions++;
            this.enableLineType(changeOriginal, d.Parser.LineType.DELETED, true);
            this.enableLineType(changeModified, d.Parser.LineType.DELETED, true);
          }

          if (currentRange.newChars && !currentRange.oldChars) {
            insertions++;
            this.enableLineType(changeOriginal, d.Parser.LineType.ADDED, true);
            this.enableLineType(changeModified, d.Parser.LineType.ADDED, true);
          }
        }
      } else if (change.type) {
        // todo(igor.alexeenko): Temporary measure.
        this.enableLineType(chunk.original[0], d.Parser.LineType.INLINE, true);
        this.enableLineType(chunk.modified[0], d.Parser.LineType.INLINE, true);
      }

      this.enableLineType(chunk, d.Parser.LineType.ADDED,
          insertions && !deletions);

      this.enableLineType(chunk, d.Parser.LineType.DELETED,
          deletions && !insertions);
    }

    return chunk;
  };

  /**
   * Checks if chunk was deleted from original code or added in modified.
   * @type {d.parsers.parserFn}
   */
  d.parsers.addedOrDeleted = function(chunk, change) {
    var isAdded = change.newLines && !change.oldLines;
    var isDeleted = change.oldLines && !change.newLines;

    if (isAdded) {
      this.enableLineType(chunk, d.Parser.LineType.ADDED, isAdded);
      this.enableLineType(chunk.original[0], d.Parser.LineType.ADDED, isAdded);
      this.enableLineType(chunk.modified[0], d.Parser.LineType.ADDED, isAdded);
    }

    if (isDeleted) {
      this.enableLineType(chunk, d.Parser.LineType.DELETED, isDeleted);
      this.enableLineType(chunk.original[0], d.Parser.LineType.DELETED,
          isDeleted);
      this.enableLineType(chunk.modified[0], d.Parser.LineType.DELETED,
          isDeleted);
    }

    return chunk;
  };

  /**
   * Checks, if end-of-line symbols were changed.
   * @type {d.parsers.parserFn}
   */
  d.parsers.EOLChanged = function(chunk, change) {
    if (change.ranges) {
      var joinOriginal = d.parsers.joinInlineContent(chunk.original);
      var joinModified = d.parsers.joinInlineContent(chunk.modified);

      var originalEOLs = joinOriginal.match(d.EOLRegex.ALL);
      var modifiedEOLs = joinModified.match(d.EOLRegex.ALL);

      var EOLChanged = originalEOLs && modifiedEOLs &&
          !d.arraysAreEqual(originalEOLs, modifiedEOLs);

      if (EOLChanged) {
        this.enableLineType(chunk, d.Parser.LineType.EOL_CHANGED, true);
      }
    }

    return chunk;
  };

  /**
   * Returns string contents of {@link d.Parser.OutputLineContent}.
   * @param {d.Parser.OutputLineContent} lines
   * @return {string}
   */
  d.parsers.joinInlineContent = function(lines) {
    var lineContent = '';

    lines.forEach(function(line) {
      lineContent += line.code;
    });

    return lineContent;
  };


  return d.parsers;
});
