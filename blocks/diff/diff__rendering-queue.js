/**
 * @fileoverview Diff rendering queue is used when you need to render some
 * instances of {@link DiffTool}. In this case, this queue renders them
 * one by one to make them appear faster.
 * @author igor.alexeenko (Igor Alekseyenko)
 */
 
define([
  'diff/diff',
  'diff/diff__tools',
  'global/global__modules'
], function(DiffTool, d, Module) {
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
    var operationWrap = d.bindContext(function() {
      if (!d.isDef(opt_context)) {
        opt_context = null;
      }

      var queueRecord = {
        instance: diff,
        operation: operation
      };

      var handler = this.getOnDiffRenderHandler_(queueRecord);
      diff.getHandler().one(DiffTool.EventType.AFTER_RENDER, handler);
      operation.call(opt_context);
    }, this);

    var lastItemInQueue = d.peekArray(this.queue_);
    if (lastItemInQueue) {
      lastItemInQueue.instance.getHandler().on(DiffTool.EventType.AFTER_RENDER,
          operationWrap);
    } else {
      operationWrap();
    }
  };

  /**
   * Disposal of whole queue. Disposes all elements and empties the queue.
   */
  d.RenderingQueue.prototype.dispose = function() {
    this.queue_.forEach(function(queueRecord) {
      queueRecord.instance.dispose();
      queueRecord = null;
    });

    this.queue_ = null;
  };

  /**
   * @param {Object} queueRecord
   * @return {function}
   * @private
   */
  d.RenderingQueue.prototype.getOnDiffRenderHandler_ = function(queueRecord) {
    return d.bindContext(function(evt) {
      this.onDiffRender_.call(evt, queueRecord);
    }, this);
  };

  /**
   * @param {jQuery.Event} evt
   * @param {Object} queueRecord
   * @private
   */
  d.RenderingQueue.prototype.onDiffRender_ = function(evt, queueRecord) {
    this.queue_ = d.deleteFromArray(this.queue_, queueRecord);
  };

  Module.add('diffRenderingQueue', {
    getRenderingQueue: {
      method: function() {
        return d.RenderingQueue;
      },
      override: true
    }
  });

  return d.RenderingQueue;
});
