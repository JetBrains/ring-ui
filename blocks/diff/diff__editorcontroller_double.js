/**
 * @fileoverview Controller for double-pane editor.
 * @author igor.alexeenko (Igor Alexeenko)
 */

define(['diff/diff__tools', 'diff/diff__editorcontroller'], function(diffTool) {
  /**
   * @param {boolean=} opt_editable
   * @constructor
   * @extends {diffTool.EditorController}
   */
  diffTool.DoubleEditorController = function(opt_editable) {
    if (diffTool.isDef(opt_editable)) {
      diffTool.DoubleEditorController._super.constructor.call(this,
          opt_editable);
    }
  };
  diffTool.inherits(diffTool.DoubleEditorController, diffTool.EditorController);
});
