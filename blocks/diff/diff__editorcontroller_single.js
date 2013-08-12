/**
 * @fileoverview Controller for single-pane editor.
 * @author igor.alexeenko (Igor Alexeenko)
 */

define(['diff/diff__tools', 'diff/diff__editorcontroller'], function(diffTool) {
  /**
   * @param {boolean=} opt_editable
   * @constructor
   * @extends {diffTool.EditorController}
   */
  diffTool.SingleEditorController = function(opt_editable) {
    if (diffTool.isDef(opt_editable)) {
      diffTool.SingleEditorController._super.constructor.call(this,
          opt_editable);
    }
  };
  diffTool.inherit(diffTool.SingleEditorController, diffTool.EditorController);
});
