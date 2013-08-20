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
        false);

    /**
     * @type {diffTool.ParserSinglePane}
     * @private
     */
    this.codeParser_ = new diffTool.ParserSinglePane();
  };
  diffTool.inherit(diffTool.SingleEditorController, diffTool.EditorController);

  /**
   * IDs of Handlebars templates, used in this files.
   * @enum {string}
   */
  diffTool.SingleEditorController.Template = {
    LAYOUT: 'diff__singlepane',
    GUTTER_LINE: 'diff__singlepane_gutterline',
    CODE_LINE: 'diff__singlepane_codeline',
    CODE_LINE_MODIFIED: 'diff__singlepane_inlinechange'
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
  diffTool.SingleEditorController.prototype.setEditableInternal =
      diffTool.nullFunction;

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
        diffTool.ParserSinglePane.LineType.UNCHANGED, '',
        diffTool.ParserSinglePane.LineType.MODIFIED,
            'diff__gutterline_modified',
        diffTool.ParserSinglePane.LineType.ORIGINAL,
            'diff__gutterline_original',
        diffTool.ParserSinglePane.LineType.FOLDED,
            'diff__gutterline_folded');

    options.additionalClassName = codeTypeToClassName[line.codeType];
    options.originalLineNumber = line.originalLineNumber;
    options.modifiedLineNumber = line.modifiedLineNumber;

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
    var codeTypeToClassName = diffTool.createObject(
        diffTool.ParserSinglePane.LineType.UNCHANGED, '',
        diffTool.ParserSinglePane.LineType.MODIFIED, 'diff__codeline_modified',
        diffTool.ParserSinglePane.LineType.ORIGINAL, 'diff__codeline_original',
        diffTool.ParserSinglePane.LineType.FOLDED, 'diff__codeline_folded');

    options.additionalClassName = codeTypeToClassName[line.codeType];
    options.line = this.getCodeLine_(line.line);

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

    line.forEach(function(change) {
      var template = Handlebars.partials[
          diffTool.SingleEditorController.Template.CODE_LINE_MODIFIED]({
        additionalClassName: this.getAdditionalClassName_(change.chars,
            change.codeType),
        code: change.chars
      });

      lineCode.push(template);
    }, this);

    return lineCode.join('');
  };

  /**
   * @param {string} chars
   * @param {diffTool.ParserSinglePane.LineType} codeType
   * @private
   */
  diffTool.SingleEditorController.getAdditionalClassName_ = function(chars,
      codeType) {
    var className = [];

    var codeTypeToClassName = diffTool.createObject(
        diffTool.ParserSinglePane.LineType.UNCHANGED, 'diff__inline_unchanged',
        diffTool.ParserSinglePane.LineType.MODIFIED, 'diff__inline_modified',
        diffTool.ParserSinglePane.LineType.ORIGINAL, 'diff__inline_original');

    className.push(codeTypeToClassName[codeType]);

    if (diffTool.isEmptyString(chars)) {
      className.push('diff__inline_empty');
    }

    return className.join(' ');
  };
});
