function RevisionGraph() {
  var POSITION_WIDTH = 16;                          // Single position width (px)
  var MAX_COLOR = 10;                               // Color map size
  var ARROW_DOWN = "l0,10 l-5,-5 l5,5.5 l5,-5.5 ";  // .5 because line width is 2px
  var ARROW_UP = "l0,-10 l5,5 l-5,-5.5 l-5,5.5 ";   // .5 because line width is 2px

  var element_;

  /**
   *  Node types
   *  @enum {Number}
   */
  var nodeTypes = { NODE: 0x01, ARROW_UP: 0x02, ARROW_DOWN: 0x02};

  /**
   * @type {Element}
   */
  var revisionsContainer_;

  /**
   * @type {Element}
   */
  var svg_;

  /**
   * @type {Function}
   */
  var resizeCommand_;

  /**
   * Graph data
   */
  var graph_;

  /**
   * Revisions data
   * @type {Array}
   */
  var revisions_ = [];

  /**
   * Graph + revisions list width (px)
   * @type {Number}
   */
  var fullWidth_;

  /**
   * Graph height (px)
   * @type {Number}
   */
  var graphHeight_;

  /**
   * Item number to item offset map
   * @type {Object}
   */
  var offsetsCache_ = {};

  /**
   * @param {Element} revisionsContainer
   * @constructor
   */
  function RevisionGraph(revisionsContainer) {
    revisionsContainer_ = revisionsContainer;
    svg_ = createSvgElement_("svg");

    // SVG is not supported
    if (svg_ == null) {
      return;
    }

    element_ = document.createElement("div");
    element_.className = "revision-graph";
    element_.appendChild(svg_);

    resizeCommand_ = $.debounce(function () {
      // Check width, reset offsets cache if differs
      var fullWidth = $(revisionsContainer_).parent().width();
      if (fullWidth != fullWidth_) {
        fullWidth_ = fullWidth;
        offsetsCache_ = {};
      }

      // Check height, re-render the graph if differs
      if (element_.offsetHeight != graphHeight_) {
        adjustRevisionsContainer_();
        var graphHeight = element_.offsetHeight;
        graphHeight_ = graphHeight;
        svg_.style.height = graphHeight + "px";
        render_();
      }
    }, 50, false);

    $(window).on('resize.revisionGraph', function () {
      resizeCommand_();
    });
  }

  function setGraph(graph) {
    graph_ = graph;
  }

  function setRevisions(revisions, append) {
    if (!append) {
      revisions_ = [];
    }

    revisions_.concat(revisions);
  }

  function resize(force) {
    if (force) {
      offsetsCache_ = {};
    }

    resizeCommand_ && resizeCommand_();
  }

  // Implementation

  function onUnload() {
    $(window).off('resize.revisionGraph');

    graph_ = null;
    revisions_ = [];
    offsetsCache_ = {};
  }

  function adjustRevisionsContainer_() {
    var graphWidth = getGraphWidth_();
    var marginLeft = graphWidth > 0 ? graphWidth + 8 : 0;
    revisionsContainer_.style.marginLeft = marginLeft + "px";
  }

  function render_() {
    if (graph_ == null) {
      return;
    }

    while (svg_.firstChild) {
      svg_.removeChild(svg_.firstChild);
    }

    svg_.style.width = getGraphWidth_() + "px";

    /**
     * @type {{Number, Element}}
     */
    var nodeGroupIndex = {};

    /**
     * @type {{Number, Element}}
     */
    var solidEdgeGroupIndex = {};

    /**
     * @type {{Number, Element}}
     */
    var dashedEdgeGroupIndex = {};

    /**
     * @type {{Element, String}}
     */
    var buildersIndex = {};

    var rowsArray = graph_.getRowsArray();
    if (rowsArray == null || rowsArray.length == 0) {
      return;
    }

    for (var rowIdx = 0; rowIdx < rowsArray.length; ++rowIdx) {
      var rowData = rowsArray[rowIdx];

      var nodesArray = rowData.getNodesArray();
      if (nodesArray == null || nodesArray.length == 0) {
        continue;
      }
      for (var j = 0; j < nodesArray.length; ++j) {
        var nodeData = nodesArray[j];
        var nodePosition = nodeData.getPosition();
        var nodeColor = nodeData.getColor();
        var nodeType = nodeData.getType();

        var nodeGroupElement = getGroupByColor_(nodeColor, true, null, nodeGroupIndex);
        if (nodeType == nodeTypes.NODE) {
          var commitNode = createNodeElement_();
          commitNode.setAttribute("cx", calculateOffsetLeft_(nodePosition).toString());
          commitNode.setAttribute("cy", getOffsetTop_(rowIdx).toString());

          if (revisions_.length > rowIdx) {
            var revision = revisions_[rowIdx];
            commitNode.setAttribute("title", getNodeTitle_(revision));
            commitNode.setAttribute("id", "node-" + revision.getRevisionIdShort());
          }

          nodeGroupElement.appendChild(commitNode);
        } else {
          var nodeBuilder = getBuilderByElement_(nodeGroupElement, buildersIndex);
          var nodeMoveX = calculateOffsetLeft_(nodePosition);
          var nodeMoveY = getOffsetTop_(rowIdx);
          moveTo_(nodeMoveX, nodeMoveY, nodeBuilder);
          nodeBuilder.append(nodeType == nodeTypes.ARROW_DOWN ? ARROW_DOWN : ARROW_UP);
        }
      }

      var edgesArray = rowData.getEdgesArray();
      if (edgesArray == null || edgesArray.length == 0) {
        continue;
      }
      for (var k = 0; k < edgesArray.length; ++k) {
        var edgeData = edgesArray[k];
        var edgePosition = edgeData.getPosition();
        var edgeToPosition = edgeData.getToPosition();
        var edgeColor = edgeData.getColor();

        var isUp = edgeData.getIsUp();
        var isSolid = edgeData.getIsSolid();

        var edgeGroupElement = getGroupByColor_(edgeColor, false, null, nodeGroupIndex); // Make sure the node colors are
        var className = edgeGroupElement.getAttribute("class");                         // consistent with edge colors.
        if (!isSolid) {
          edgeGroupElement = getGroupByColor_(edgeColor, false, className + " revision-graph__dashed", dashedEdgeGroupIndex);
        } else {
          edgeGroupElement = getGroupByColor_(edgeColor, false, className, solidEdgeGroupIndex);
        }
        var edgeBuilder = getBuilderByElement_(edgeGroupElement, buildersIndex);

        var edgeMoveX = calculateOffsetLeft_(edgePosition);
        var edgeMoveY = getOffsetTop_(rowIdx);
        moveTo_(edgeMoveX, edgeMoveY, edgeBuilder);

        var lineX = calculateOffsetLeft_(edgeToPosition);
        var lineY = getOffsetTop_(isUp ? rowIdx - 1 : rowIdx + 1);
        lineTo_(lineX, lineY, edgeBuilder);
      }
    }

    for (var entry in buildersIndex) {
      if (buildersIndex.hasOwnProperty(entry)) {
        var groupElement = entry.getKey();
        var builder = entry.getValue();

        if (builder.length > 0) {
          builder = builder.substring(0, builder.length - 2); // cut the last space off
          var element = createPathElement_();
          element.setAttribute("d", builder);
          groupElement.appendChild(element);
        }
      }
    }
  }

  /**
   * @returns {Element}
   */
  function createNodeElement_() {
    var node = createSvgElement_("circle");
    node.setAttribute("class", "revision-graph__node");
    node.setAttribute("r", "4");
    return node;
  }

  /**
   * @returns {Element}
   */
  function createPathElement_() {
    var line = createSvgElement_("path");
    line.setAttribute("class", "revision-graph__line");
    return line;
  }

  /**
   * @param {String} name
   * @returns {Element|null}
   */
  function createSvgElement_(name) {
    if (Modernizr.svg) {
      return null;
    }
    return document.createElementNS("http://www.w3.org/2000/svg", name);
  }

  /**
   * @param {Number} lineX
   * @param {Number} lineY
   * @param {String} builder
   * @returns {String}
   */
  function lineTo_(lineX, lineY, builder) {
    builder += 'L' + lineX + ',' + lineY + ' ';
    return builder;
  }

  /**
   * @param {Number} moveX
   * @param {Number} moveY
   * @param {String} builder
   * @returns {String}
   */
  function moveTo_(moveX, moveY, builder) {
    builder += 'M' + moveX + ',' + moveY + ' ';
    return builder;
  }

  /**
   * @param {String} color
   * @param {Boolean} isAppend
   * @param {String} classValue
   * @param {Number} groupIndex
   * @returns {Element}
   */
  function getGroupByColor_(color, isAppend, classValue, groupIndex) {
    var element = groupIndex[color];
    if (element == null) {
      element = createSvgElement_("g");
      element.setAttribute("class", classValue != null ? classValue : "revision-graph__group_" + (groupIndex.length % MAX_COLOR));
      groupIndex[color] = element;
      if (isAppend) {
        svg_.appendChild(element);
      } else {
        svg_.insertBefore(element, svg_.firstChild);
      }
    }
    return element;
  }

  /**
   * @param {Element} element
   * @param buildersIndex
   * @returns {String}
   */
  function getBuilderByElement_(element, buildersIndex) {
    var builder = buildersIndex[element];
    if (builder == null) {
      builder = "";
      buildersIndex[element] = builder;
    }
    return builder;
  }

  /**
   * @param revision
   * @returns {String}
   */
  function getNodeTitle_(revision) {
    var revisionId = revision.getRevisionIdShort();
    var branchLabels = getBranchLabels_(revision);
    return branchLabels.length > 0 ? revisionId + " (" + branchLabels.join(", ") + ")" : revisionId;
  }

  /**
   * @param revision
   * @returns {Array}
   */
  function getBranchLabels_(revision) {
    var branchAvailability = revision.getBranchAvailability();
    if (branchAvailability != null) {
      var branches = [];
      for (var i = 0; i < branchAvailability.length; i++) {
        branches.push(branchAvailability[i]);
      }
      return branches;
    }
    return [];
  }

  /**
   * @returns {Number}
   */
  function getGraphWidth_() {
    return graph_ == null ? 0 : graph_.offsetWidth * POSITION_WIDTH;
  }

  /**
   * @param {Number} position
   * @returns {Number}
   */
  function calculateOffsetLeft_(position) {
    return POSITION_WIDTH * position + POSITION_WIDTH / 2;
  }

  /**
   * @param {Number} nodeIndex
   * @returns {Number}
   */
  function getOffsetTop_(nodeIndex) {
    var revisionItemOffsetTop = offsetsCache_[nodeIndex];
    if (revisionItemOffsetTop == null) {
      revisionItemOffsetTop = calculateOffsetTop_(nodeIndex);
      offsetsCache_[nodeIndex] = revisionItemOffsetTop;
    }
    return revisionItemOffsetTop;
  }

  /**
   * @param {Number} index
   * @returns {Number}
   */
  function calculateOffsetTop_(index) {
    var revisionItem = $('.revision-item_revision').eq(index);
    return revisionItem.length > 0 ? parseInt(revisionItem.position().top) + parseInt(revisionItem.css('padding-top')) + 9 : 0;
  }
}
