/**
 * @fileoverview Divider between two editors, which shows connectors from
 * edited parts of original code to according edited parts of modified code.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'diff/diff__tools',
  'handlebars',
  'diff/diff__parser_doublepane'
], function(d, Handlebars) {
  /**
   * @param {Element} element
   * @constructor
   */
  d.DoubleEditorDivider = function(element) {
    if (!d.isDef(d.DoubleEditorDivider.rangeTypeToConnectorClass_)) {
      d.DoubleEditorDivider.getRangeTypeToConnectorClass();
    }

    this.element_ = element;
    this.ranges_ = [];
    this.visibleVRangeOriginal_ = null;
    this.visibleVRangeModified_ = null;

    this.connectorsCanvas_ = document.createElementNS(
        d.DoubleEditorDivider.SVG_NAMESPACE, 'svg');

    this.element_.appendChild(this.connectorsCanvas_);
  };

  /**
   * @type {string}
   * @const
   */
  d.DoubleEditorDivider.SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

  /**
   * IDs of path types.
   * @enum {string}
   */
  d.DoubleEditorDivider.PathType = {
    LOWER_LINE: 0x00,
    PATH: 0x01,
    UPPER_LINE: 0x02
  };

  /**
   * @enum {string}
   */
  d.DoubleEditorDivider.ClassName = {
    CONNECTOR_BASE: 'ring-diff-connector',
    CONNECTOR_PATH: 'ring-diff-connector__path',
    CONNECTOR_PATH_DELETED: 'ring-diff-connector__path_deleted',
    CONNECTOR_PATH_ADDED: 'ring-diff-connector__path_added',
    CONNECTOR_PATH_INLINE: 'ring-diff-connector__path_modified',
    CONNECTOR_LINE: 'ring-diff-connector__line'
  };

  /**
   * Side-effect of this method is creation of lookup-table of range types
   * to class names for connectors.
   * @static
   */
  d.DoubleEditorDivider.getRangeTypeToConnectorClass = function() {
    /**
     * @static
     * @type {Object.<d.Parser.LineType, string>}
     * @private
     */
    d.DoubleEditorDivider.rangeTypeToConnectorClass_ = d.createObject(
        d.Parser.LineType.NULL, '',
        d.Parser.LineType.DELETED,
            d.DoubleEditorDivider.ClassName.CONNECTOR_PATH_DELETED,
        d.Parser.LineType.ADDED,
            d.DoubleEditorDivider.ClassName.CONNECTOR_PATH_ADDED,
        d.Parser.LineType.INLINE,
            d.DoubleEditorDivider.ClassName.CONNECTOR_PATH_INLINE,
        d.Parser.LineType.INLINE | d.Parser.LineType.DELETED,
            d.DoubleEditorDivider.ClassName.CONNECTOR_PATH_INLINE,
        d.Parser.LineType.INLINE | d.Parser.LineType.ADDED,
            d.DoubleEditorDivider.ClassName.CONNECTOR_PATH_INLINE);
  };

  /**
   * @static
   * @param {d.Parser.LineType} rangeType
   */
  d.DoubleEditorDivider.getClassFromRangeType = function(rangeType) {
    var usedTypes = [d.Parser.LineType.ADDED, d.Parser.LineType.DELETED,
      d.Parser.LineType.INLINE];
    var normalizedType = d.Parser.normalizeType(rangeType, usedTypes);

    return d.DoubleEditorDivider.rangeTypeToConnectorClass_[normalizedType];
  };

  /**
   * Fully redraws viewport.
   */
  d.DoubleEditorDivider.prototype.redrawConnectors = function() {
    if (!d.isDef(this.ranges_) || !d.isDef(this.connectorsCanvas_)) {
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
    this.connectors_ = this.ranges_.map(function(range, index) {
      if (Boolean(range.type)) {
        var nextRange = this.ranges_[index + 1];

        var connector = document.createElementNS(
            d.DoubleEditorDivider.SVG_NAMESPACE, 'g');

        var connectorPath = document.createElementNS(
            d.DoubleEditorDivider.SVG_NAMESPACE, 'path');
        connectorPath.setAttribute('d',
            d.DoubleEditorDivider.getPathForRange(
                range, this.visibleVRangeOriginal_, this.visibleVRangeModified_,
                connectorCanvasWidth,
                d.DoubleEditorDivider.PathType.PATH));
        connectorPath.setAttribute('class',
            d.DoubleEditorDivider.getClassFromRangeType(range.type));

        var connectorLowerBorder = document.createElementNS(
            d.DoubleEditorDivider.SVG_NAMESPACE, 'path');
        connectorLowerBorder.setAttribute('d',
            d.DoubleEditorDivider.getPathForRange(
                range, this.visibleVRangeOriginal_, this.visibleVRangeModified_,
                connectorCanvasWidth,
                d.DoubleEditorDivider.PathType.LOWER_LINE));
        connectorLowerBorder.setAttribute('class',
            d.DoubleEditorDivider.ClassName.CONNECTOR_LINE);

        var connectorUpperBorder = document.createElementNS(
            d.DoubleEditorDivider.SVG_NAMESPACE, 'path');
        connectorUpperBorder.setAttribute('d',
            d.DoubleEditorDivider.getPathForRange(
                range, this.visibleVRangeOriginal_, this.visibleVRangeModified_,
                connectorCanvasWidth,
                d.DoubleEditorDivider.PathType.UPPER_LINE));
        connectorUpperBorder.setAttribute('class',
            d.DoubleEditorDivider.ClassName.CONNECTOR_LINE);

        connector.appendChild(connectorPath);
        connector.appendChild(connectorUpperBorder);
        connector.appendChild(connectorLowerBorder);

        this.connectorsCanvas_.appendChild(connector);

        connectorUpperBorder.setAttribute('transform', 'translate(0, 0.5)');

        if (d.isDef(nextRange) &&
            d.Parser.lineHasType(range, d.Parser.LineType.INLINE) &&
            d.Parser.lineHasType(nextRange, d.Parser.LineType.INLINE)) {
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
   * Returns SVG-path for given range coordinates.
   * @static
   * @param {Object} range
   * @param {d.Range} visibleRangeOriginal
   * @param {d.Range} visibleRangeModified
   * @param {number} splitWidth
   * @param {d.DoubleEditorDivider.PathType} type
   * @return {string}
   */
  d.DoubleEditorDivider.getPathForRange = function(range, visibleRangeOriginal,
       visibleRangeModified, splitWidth, type) {
    var leftFrom = range.originalFrom - visibleRangeOriginal.from;
    var rightFrom = range.modifiedFrom - visibleRangeModified.from;
    var leftTo = range.originalTo - visibleRangeOriginal.from;
    var rightTo = range.modifiedTo - visibleRangeModified.from;

    /**
     * @type {number}
     * @const
     */
    var CURVE_RATIO = 0.2;

    if (range.type === d.Parser.LineType.ADDED &&
        type === d.DoubleEditorDivider.PathType.LOWER_LINE) {
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

    // todo(igor.alexeenko): Make paths templates compileable from runtime.
    // Separate files for such simple templates as paths is insanity, they
    // should be inlined here, but it is not obvious how to compile Handlebars
    // templates from runtime. Handlebars.registerHelper is bad solution
    // beacuse inside helper I should concatenate string by hands and it is
    // bad solution already.
    switch (type) {
    case d.DoubleEditorDivider.PathType.LOWER_LINE:
      return Handlebars.partials['diff__doublepane-divider-lower-border'](
          templateData);
    case d.DoubleEditorDivider.PathType.UPPER_LINE:
      return Handlebars.partials['diff__doublepane-divider-upper-border'](
          templateData);
    default:
      return Handlebars.partials['diff__doublepane-divider-path'](
          templateData);
    }
  };

  /**
   * @param {d.Range} vRangeOriginal
   * @param {d.Range} vRangeModified
   */
  d.DoubleEditorDivider.prototype.setVisibleRange = function(vRangeOriginal,
      vRangeModified) {
    this.visibleVRangeOriginal_ = vRangeOriginal;
    this.visibleVRangeModified_ = vRangeModified;
    this.redrawConnectors();
  };

  /**
   * @param {Array.<Object>} ranges
   */
  d.DoubleEditorDivider.prototype.setRanges = function(ranges) {
    this.ranges_ = ranges;
    this.redrawConnectors();
  };

  /**
   * Disposal of connectors element.
   */
  d.DoubleEditorDivider.prototype.dispose = function() {
    this.connectors_.forEach(function(connector) {
      connector.outerHTML = '';
    }, this);

    this.connectorsCanvas_.innerHTML = '';

    this.visibleVRangeModified_ = null;
    this.visibleVRangeOriginal_ = null;
    this.connectors_ = null;
    this.ranges_ = null;
    this.connectorsCanvas_ = null;
  };

  return d.DoubleEditorDivider;
});
