/**
 * @fileoverview Controller for single-pane editor.
 * @author igor.alexeenko (Igor Alexeenko)
 */

define(['diff/diff__tools', 'handlebars', 'diff/diff__editorcontroller',
  'diff/diff__parser_singlepane'], function(diffTool, Handlebars) {
  'use strict';

  /**
   * @param {Element} element
   * @constructor
   * @extends {diffTool.EditorController}
   */
  diffTool.SingleEditorController = function(element) {
    diffTool.SingleEditorController.super_.constructor.call(this, element,
        false, diffTool.ParserSinglePane.getInstance());
  };
  diffTool.inherit(diffTool.SingleEditorController, diffTool.EditorController);

  /**
   * IDs of Handlebars templates, used in this files.
   * @enum {string}
   */
  diffTool.SingleEditorController.Template = {
    LAYOUT: 'diff_singlepane',
    GUTTER_LINE: 'diff_singlepane__gutterline',
    CODE_LINE: 'diff_singlepane__codeline',
    CODE_LINE_MODIFIED: 'diff_singlepane__inlinechange'
  };

  /**
   * @override
   */
  diffTool.SingleEditorController.prototype.setEnabledInternal = function(
      enabled) {
    if (!enabled) {
      this.element_.innerHTML = '';
    }
  };

  /**
   * @override
   */
  diffTool.SingleEditorController.prototype.setContentInternal = function(
      original, modified, diff) {
    var parsedContent = this.codeParser_.parse(original, modified, diff);

    this.element_.innerHTML = Handlebars.partials[
        diffTool.SingleEditorController.Template.LAYOUT]();

    this.gutterElement_ = this.element_.querySelector('.diff__gutter tbody');
    this.codeElement_ = this.element_.querySelector('.diff__code tbody');

    var gutterOutput = [];
    var codeOutput = [];

    if (!parsedContent) {
      return;
    }

    parsedContent.forEach(function(line) {
      gutterOutput.push(Handlebars.partials[
          diffTool.SingleEditorController.Template.GUTTER_LINE](
              diffTool.SingleEditorController.getGutterData_(line)));
      codeOutput.push(Handlebars.partials[
          diffTool.SingleEditorController.Template.CODE_LINE](
              diffTool.SingleEditorController.getCodeLineData_(line)));
    }, this);

    this.gutterElement_.innerHTML = gutterOutput.join('');
    this.codeElement_.innerHTML = codeOutput.join('');
  };

  /**
   * @static
   * @param {diffTool.ParserSinglePane.BufferLine} line
   * @return {Object}
   * @private
   */
  diffTool.SingleEditorController.getGutterData_ = function(line) {
    var options = {};
    /**
     * Lookup table of line types to css-classes for this lines in editor.
     * @type {Object.<diffTool.SingleEditorController.LineType, string>}
     */
    var codeTypeToClassName = diffTool.createObject(
        diffTool.Parser.LineType.UNCHANGED, '',
        diffTool.Parser.LineType.ADDED,
            'diff__gutterline_modified',
        diffTool.Parser.LineType.DELETED,
            'diff__gutterline_original',
        diffTool.Parser.LineType.FOLDED,
            'diff__gutterline_folded');

    options.additionalClassName = codeTypeToClassName[line.type];
    options.originalLineNumber = line.lineOriginal;
    options.modifiedLineNumber = line.lineModified;

    return options;
  };

  /**
   * @static
   * @param {diffTool.ParserSinglePane.BufferLine} line
   * @return {Object}
   * @private
   */
  diffTool.SingleEditorController.getCodeLineData_ = function(line) {
    var options = {};

    /**
     * Lookup table of line types to css-classes for lines.
     * @type {Object.<diffTool.ParserSinglePane.LineType, string>}
     */
    var lineTypeToClassName = diffTool.createObject(
        diffTool.Parser.LineType.UNCHANGED, '',
        diffTool.Parser.LineType.ADDED, 'diff__codeline_modified',
        diffTool.Parser.LineType.DELETED, 'diff__codeline_original',
        diffTool.Parser.LineType.FOLDED, 'diff__codeline_folded');

    options.additionalClassName = lineTypeToClassName[line.type];
    options.line = this.getCodeLine_(line.content);

    return options;
  };

  /**
   * @static
   * @param {diffTool.ParserSinglePane.BufferModifiedLine|string} line
   * @return {string}
   * @private
   */
  diffTool.SingleEditorController.getCodeLine_ = function(line) {
    if (typeof line === 'string') {
      return line;
    }

    var lineCode = [];

    if (!line) {
      return '';
    }

    line.forEach(function(change) {
      var template = Handlebars.partials[
          diffTool.SingleEditorController.Template.CODE_LINE_MODIFIED]({
        additionalClassName: this.getAdditionalClassName_(
            change.content,
            change.type),
        code: change.content
      });

      lineCode.push(template);
    }, this);

    return lineCode.join('');
  };

  /**
   * @param {string} chars
   * @param {diffTool.Parser.LineType} lineType
   * @private
   */
  diffTool.SingleEditorController.getAdditionalClassName_ = function(chars,
      lineType) {
    var className = [];

    var codeTypeToClassName = diffTool.createObject(
        diffTool.Parser.LineType.UNCHANGED, 'diff__inline_unchanged',
        // todo(igor.alexeenko): Change to bitwise or.
        diffTool.Parser.LineType.ADDED, 'diff__inline_modified',
        diffTool.Parser.LineType.DELETED, 'diff__inline_modified');

    className.push(codeTypeToClassName[lineType]);

    if (diffTool.isEmptyString(chars)) {
      className.push('diff__inline_empty');
    }

    return className.join(' ');
  };

  return diffTool.SingleEditorController;
});
