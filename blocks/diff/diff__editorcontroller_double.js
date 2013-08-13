/**
 * @fileoverview Controller for double-pane editor.
 * @author igor.alexeenko (Igor Alexeenko)
 */

define(['diff/diff__tools', 'diff/diff__editorcontroller'], function(diffTool) {
  /**
   * @param {Element} element
   * @constructor
   * @extends {diffTool.EditorController}
   */
  diffTool.DoubleEditorController = function(element) {
    diffTool.DoubleEditorController.super_.constructor.call(this, element,
        true);
  };
  diffTool.inherit(diffTool.DoubleEditorController, diffTool.EditorController);
});
