/**
 * @fileoverview Diff rendering queue is used when you need to render some
 * instances of {@link DiffTool}. In this case, this queue renders them
 * one by one to make them appear faster.
 * @author igor.alexeenko (Igor Alekseyenko)
 */
 
define([
  'diff/diff',
  'diff/diff__tools'
], function(DiffTool, d) {
  d.RenderingQueue = function() {
    this.onDiffRender_ = d.bindContext(this.onDiffRender_, this);

    /**
     * @type {Array.<Object>}
     * @private
     */
    this.queue_ = [];
  };

  /**
   * @param {DiffTool} diff
   * @param {function} operation
   * @param {*=} opt_context
   */
  d.RenderingQueue.prototype.push = function(diff, operation, opt_context) {
    var operationWrap = function() {
      if (!d.isDef(opt_context)) {
        opt_context = null;
      }

      var queueRecord = {
        instance: diff,
        operation: operation
      };

      diff.getHandler().on(DiffTool.EventType.AFTER_RENDER, queueRecord,
          this.onDiffRender_);

      operation.call(opt_context);
    };

    var lastItemInQueue = d.peekArray(this.queue_);
    if (lastItemInQueue) {
      lastItemInQueue.instance.getHandler().on(DiffTool.EventType.AFTER_RENDER,
          operationWrap);
    } else {
      operationWrap();
    }
  };

  /**
   * @param {Element} element
   * @param {string} original
   * @param {string} modified
   * @param {Array.<Object>} diff
   * @param {DiffTool.Mode=} opt_mode
   * @return {DiffTool}
   */
  d.RenderingQueue.prototype.createAndAddToQueue = function(element, original,
      modified, diff, opt_mode) {
    var diffTool = new DiffTool(element, opt_mode);
    var operation = function() {
      diffTool.setContent(original, modified, diff);
    };

    this.push(diffTool, operation);

    return diffTool;
  };

  d.RenderingQueue.prototype.dispose = function() {
    this.queue_.forEach(function(queueRecord) {
      queueRecord.instance.dispose();
      queueRecord = null;
    });

    this.queue_ = null;
  };

  /**
   * @param {jQuery.Event}
   * @private
   */
  d.RenderingQueue.prototype.onDiffRender_ = function(evt) {
    var queueRecord = evt.data;
    this.queue_ = d.deleteFromArray(this.queue_, queueRecord);
  };

  return d.RenderingQueue;
});
