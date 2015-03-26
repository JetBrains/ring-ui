/* eslint-disable no-bitwise */
/**
 * @fileoverview Divider between two editors that shows connectors from
 * edited parts of original code to edited parts of modified code.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

var Tools = require('./diff__tools');
var Parser = require('./__parser/diff__parser');
var util = require('util');

/**
 * @param {Element} element
 * @constructor
 */
var DoubleEditorDivider = function (element) {
  if (!Tools.isDef(DoubleEditorDivider.rangeTypeToConnectorClass_)) {
    DoubleEditorDivider.getRangeTypeToConnectorClass();
  }

  this.element_ = element;
  this.ranges_ = [];
  this.visibleVRangeOriginal_ = null;
  this.visibleVRangeModified_ = null;

  this.connectorsCanvas_ = document.createElementNS(
    DoubleEditorDivider.SVG_NAMESPACE, 'svg');

  this.element_.appendChild(this.connectorsCanvas_);
};

/**
 * @type {string}
 * @const
 */
DoubleEditorDivider.SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

/**
 * IDs of path types.
 * @enum {string}
 */
DoubleEditorDivider.PathType = {
  LOWER_LINE: 0x00,
  PATH: 0x01,
  UPPER_LINE: 0x02
};

/**
 * @enum {string}
 */
DoubleEditorDivider.ClassName = {
  CONNECTOR_BASE: 'ring-diff-connector',
  CONNECTOR_PATH: 'ring-diff-connector__path',
  CONNECTOR_PATH_DELETED: 'ring-diff-connector__path_deleted',
  CONNECTOR_PATH_ADDED: 'ring-diff-connector__path_added',
  CONNECTOR_PATH_INLINE: 'ring-diff-connector__path_modified',
  LINE_BASE: 'ring-diff-connector__line',
  LINE_DELETED: 'ring-diff-connector__line_deleted',
  LINE_ADDED: 'ring-diff-connector__line_added',
  LINE_INLINE: 'ring-diff-connector__line_modified'
};

/**
 * Side-effect of this method is creation of a lookup table of range types
 * to class names for connectors.
 * @static
 */
DoubleEditorDivider.getRangeTypeToConnectorClass = function () {
  /**
   * @static
   * @type {Object.<Parser.LineType, DoubleEditorDivider.ClassName>}
   * @private
   */
  DoubleEditorDivider.rangeTypeToConnectorClass_ = Tools.createObject(
    Parser.LineType.NULL, '',
    Parser.LineType.DELETED,
    DoubleEditorDivider.ClassName.CONNECTOR_PATH_DELETED,
    Parser.LineType.ADDED,
    DoubleEditorDivider.ClassName.CONNECTOR_PATH_ADDED,
    Parser.LineType.INLINE,
    DoubleEditorDivider.ClassName.CONNECTOR_PATH_INLINE,
      Parser.LineType.INLINE | Parser.LineType.DELETED,
    DoubleEditorDivider.ClassName.CONNECTOR_PATH_INLINE,
      Parser.LineType.INLINE | Parser.LineType.ADDED,
    DoubleEditorDivider.ClassName.CONNECTOR_PATH_INLINE);

  /**
   * @static
   * @type {Object.<Parser.LineType, DoubleEditorDivider.ClassName>}
   * @private
   */
  DoubleEditorDivider.rangeTypeToLineClass_ = Tools.createObject(
    Parser.LineType.NULL, '',
    Parser.LineType.DELETED,
    DoubleEditorDivider.ClassName.LINE_DELETED,
    Parser.LineType.ADDED,
    DoubleEditorDivider.ClassName.LINE_ADDED,
    Parser.LineType.INLINE,
    DoubleEditorDivider.ClassName.LINE_INLINE,
      Parser.LineType.INLINE | Parser.LineType.DELETED,
    DoubleEditorDivider.ClassName.LINE_INLINE,
      Parser.LineType.INLINE | Parser.LineType.ADDED,
    DoubleEditorDivider.ClassName.LINE_INLINE);
};

/**
 * @static
 * @param {Parser.LineType} rangeType
 * @param {DoubleEditorDivider.PathType} pathType
 */
DoubleEditorDivider.getClassFromRangeType = function (rangeType, pathType) {
  var usedTypes = [Parser.LineType.ADDED, Parser.LineType.DELETED,
    Parser.LineType.INLINE];
  var normalizedType = Parser.normalizeType(rangeType, usedTypes);

  if (pathType === DoubleEditorDivider.PathType.LOWER_LINE ||
    pathType === DoubleEditorDivider.PathType.UPPER_LINE) {
    return DoubleEditorDivider.rangeTypeToLineClass_[normalizedType];
  }

  return DoubleEditorDivider.rangeTypeToConnectorClass_[normalizedType];
};

/**
 * Fully redraws viewport.
 */
DoubleEditorDivider.prototype.redrawConnectors = function () {
  if (!Tools.isDef(this.ranges_) || !Tools.isDef(this.connectorsCanvas_)) {
    return;
  }

  this.connectorsCanvas_.innerHTML = '';

  var connectorCanvasWidth = this.connectorsCanvas_.clientWidth;
  var connectorCanvasHeight = this.connectorsCanvas_.clientHeight;

  this.connectorsCanvas_.setAttribute('viewbox', [
    0, 0, connectorCanvasWidth, connectorCanvasHeight
  ].join(' '));

  /**
   * List of {@link SVGElement}s, which represents every connector.
   * @type {Array.<SVGElement?>}
   * @private
   */
  this.connectors_ = this.ranges_.map(function (range, index) {
    if (Boolean(range.type)) {
      var nextRange = this.ranges_[index + 1];

      var connector = document.createElementNS(
        DoubleEditorDivider.SVG_NAMESPACE, 'g');

      var connectorPath = document.createElementNS(
        DoubleEditorDivider.SVG_NAMESPACE, 'path');
      connectorPath.setAttribute('d',
        DoubleEditorDivider.getPathForRange(
          range, this.visibleVRangeOriginal_, this.visibleVRangeModified_,
          connectorCanvasWidth,
          DoubleEditorDivider.PathType.PATH));
      connectorPath.setAttribute('class',
        DoubleEditorDivider.getClassFromRangeType(range.type));

      var connectorLowerBorder = document.createElementNS(
        DoubleEditorDivider.SVG_NAMESPACE, 'path');
      connectorLowerBorder.setAttribute('d',
        DoubleEditorDivider.getPathForRange(
          range, this.visibleVRangeOriginal_, this.visibleVRangeModified_,
          connectorCanvasWidth,
          DoubleEditorDivider.PathType.LOWER_LINE));
      connectorLowerBorder.setAttribute('class', [
        DoubleEditorDivider.ClassName.LINE_BASE,
        DoubleEditorDivider.getClassFromRangeType(range.type,
          DoubleEditorDivider.PathType.LOWER_LINE)
      ].join(' '));

      var connectorUpperBorder = document.createElementNS(
        DoubleEditorDivider.SVG_NAMESPACE, 'path');
      connectorUpperBorder.setAttribute('d',
        DoubleEditorDivider.getPathForRange(
          range, this.visibleVRangeOriginal_, this.visibleVRangeModified_,
          connectorCanvasWidth,
          DoubleEditorDivider.PathType.UPPER_LINE));
      connectorUpperBorder.setAttribute('class', [
        DoubleEditorDivider.ClassName.LINE_BASE,
        DoubleEditorDivider.getClassFromRangeType(range.type,
          DoubleEditorDivider.PathType.UPPER_LINE)
      ].join(' '));

      connector.appendChild(connectorPath);
      connector.appendChild(connectorUpperBorder);
      connector.appendChild(connectorLowerBorder);

      this.connectorsCanvas_.appendChild(connector);

      connectorUpperBorder.setAttribute('transform', 'translate(0, 0.5)');

      if (Tools.isDef(nextRange) &&
        Parser.lineHasType(range, Parser.LineType.INLINE) &&
        Parser.lineHasType(nextRange, Parser.LineType.INLINE)) {
        connectorLowerBorder.setAttribute('transform', 'translate(0, 0.5)');
      } else {
        connectorLowerBorder.setAttribute('transform', 'translate(0, -0.5)');
      }

      return connector;
    }

    return null;
  }, this);

};

/**
 * Returns SVG path for given range coordinates.
 * @static
 * @param {Object} range
 * @param {Tools.Range} visibleRangeOriginal
 * @param {Tools.Range} visibleRangeModified
 * @param {number} splitWidth
 * @param {DoubleEditorDivider.PathType} type
 * @return {string}
 */
DoubleEditorDivider.getPathForRange = function (range, visibleRangeOriginal, visibleRangeModified, splitWidth, type) {
  var leftFrom = range.originalFrom - visibleRangeOriginal.from;
  var rightFrom = range.modifiedFrom - visibleRangeModified.from;
  var leftTo = range.originalTo - visibleRangeOriginal.from;
  var rightTo = range.modifiedTo - visibleRangeModified.from;

  /**
   * @type {number}
   * @const
   */
  var CURVE_RATIO = 0.2;

  if (range.type === Parser.LineType.ADDED &&
    type === DoubleEditorDivider.PathType.LOWER_LINE) {
    leftTo++;
    rightTo++;
  }

  var templateData = {
    xFrom: 0,
    xModifiedFrom: splitWidth * CURVE_RATIO,
    xModifiedTo: splitWidth * (1 - CURVE_RATIO),
    xTo: splitWidth + 1,
    leftYFrom: leftFrom,
    rightYFrom: rightFrom,
    leftYTo: leftTo,
    rightYTo: rightTo
  };

  switch (type) {
    case DoubleEditorDivider.PathType.LOWER_LINE:
      return [
        util.format('M%s %s C %s %s',
          templateData.xFrom,
          templateData.leftYTo,
          templateData.xModifiedFrom,
          templateData.leftYTo
        ),
        util.format('%s %s',
          templateData.xModifiedTo,
          templateData.rightYTo
        ),
        util.format('%s %s',
          templateData.xTo,
          templateData.rightYTo
        )
      ].join(' , ');
    case DoubleEditorDivider.PathType.UPPER_LINE:
      return [
        util.format('M%s %s C %s %s',
          templateData.xFrom,
          templateData.leftYFrom,
          templateData.xModifiedFrom,
          templateData.leftYFrom
        ),
        util.format('%s %s',
          templateData.xModifiedTo,
          templateData.rightYFrom
        ),
        util.format('%s %s',
          templateData.xTo,
          templateData.rightYFrom
        )
      ].join(' , ');
    default:
      return [
        util.format('M%s %s C %s %s',
          templateData.xFrom,
          templateData.leftYFrom,
          templateData.xModifiedFrom,
          templateData.leftYFrom
        ),
        util.format('%s %s',
          templateData.xModifiedTo,
          templateData.rightYFrom
        ),
        util.format('%s %s L %s %s C %s %s',
          templateData.xTo,
          templateData.rightYFrom,
          templateData.xTo,
          templateData.rightYTo,
          templateData.xModifiedTo,
          templateData.rightYTo
        ),
        util.format('%s %s',
          templateData.xModifiedFrom,
          templateData.leftYTo
        ),
        util.format('%s %s L %s %s Z',
          templateData.xFrom,
          templateData.leftYTo,
          templateData.xFrom,
          templateData.leftYFrom
        )
      ].join(' , ');
  }
};

/**
 * @param {Tools.Range} vRangeOriginal
 * @param {Tools.Range} vRangeModified
 */
DoubleEditorDivider.prototype.setVisibleRange = function (vRangeOriginal, vRangeModified) {
  this.visibleVRangeOriginal_ = vRangeOriginal;
  this.visibleVRangeModified_ = vRangeModified;
  this.redrawConnectors();
};

/**
 * @param {Array.<Object>} ranges
 */
DoubleEditorDivider.prototype.setRanges = function (ranges) {
  this.ranges_ = ranges;
  this.redrawConnectors();
};

/**
 * Disposal of connectors element.
 */
DoubleEditorDivider.prototype.dispose = function () {
  this.connectors_.forEach(function (connector) {
    connector.outerHTML = '';
  }, this);

  this.connectorsCanvas_.innerHTML = '';

  this.visibleVRangeModified_ = null;
  this.visibleVRangeOriginal_ = null;
  this.connectors_ = null;
  this.ranges_ = null;
  this.connectorsCanvas_ = null;
};

module.exports = DoubleEditorDivider;
