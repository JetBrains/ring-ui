/**
 * @fileoverview Additional tools, which are used by {@link DiffTool}.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define(function() {
  'use strict';

  /**
   * Namespace for DiffTool utility methods.
   */
  var diffTool = {};

  // todo(igor.alexeenko): Is there a reason to export some tools to global
  // namespace? (or simply use underscore.js instead of those custom-made
  // tools).

  /**
   * @param {*} obj
   * @return {boolean}
   */
  diffTool.isDef = function(obj) {
    return typeof obj !== 'undefined';
  };

  /**
   * Abstract method. Use link to this method for unimplemented methods in
   * base classes.
   * @throws {Error}
   */
  diffTool.abstractMethod = function() {
    throw new Error('This method is not implemented yet.');
  };

  /**
   * Null function. Use link to this method, where should not be an interaction.
   * For example in interfaces.
   */
  diffTool.nullFunction = function() {};

  /**
   * @param {Function} child
   * @param {Function} parent
   */
  diffTool.inherit = function(child, parent) {
    var EmptyConstructor = function() {};
    EmptyConstructor.prototype = parent.prototype;

    child.prototype = new EmptyConstructor();
    child.prototype.constructor = child;

    // Link to parent element to make possible to call methods of parent classes
    // from methods of children.
    child._super = parent.prototype;
  };

  return diffTool;
});
