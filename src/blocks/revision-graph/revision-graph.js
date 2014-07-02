function RevisionGraph() {
  var POSITION_WIDTH = 16;                          // Single position width (px)
  var MAX_COLOR = 10;                               // Color map size
  var ARROW_DOWN = "l0,10 l-5,-5 l5,5.5 l5,-5.5 ";  // .5 because line width is 2px
  var ARROW_UP = "l0,-10 l5,5 l-5,-5.5 l-5,5.5 ";   // .5 because line width is 2px

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
    svg_ = createSvgElement("svg");

    // SVG is not supported
    if (svg_ == null) {
      return;
    }

    setStyleName("revision-graph");
    getElement().appendChild(svg_);

    resizeCommand_ = $.debounce(function () {
      // Check width, reset offsets cache if differs
      var fullWidth = $(revisionsContainer_).parent().width();
      if (fullWidth != fullWidth_) {
        fullWidth_ = fullWidth;
        offsetsCache_ = {};
      }

      // Check height, re-render the graph if differs
      if (getElement().getOffsetHeight() != graphHeight_) {
        adjustRevisionsContainer();
        var graphHeight = getElement().getOffsetHeight();
        graphHeight_ = graphHeight;
        svg_.style.height = graphHeight + "px";
        render();
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

  function adjustRevisionsContainer() {
    var graphWidth = getGraphWidth();
    var marginLeft = graphWidth > 0 ? graphWidth + 8 : 0;
    revisionsContainer_.style.marginLeft = marginLeft + "px";
  }

  function render() {
    if (graph_ == null) {
      return;
    }

    while (svg_.firstChild) {
      svg_.removeChild(svg_.firstChild);
    }

    svg_.style.width = getGraphWidth() + "px";

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

        var nodeGroupElement = getGroupByColor(nodeColor, true, null, nodeGroupIndex);
        if (nodeType == nodeTypes.NODE) {
          var commitNode = createNodeElement();
          commitNode.setAttribute("cx", calculateOffsetLeft(nodePosition));
          commitNode.setAttribute("cy", getOffsetTop(rowIdx));

          if (revisions_.length > rowIdx) {
            var revision = revisions_[rowIdx];
            commitNode.setAttribute("title", getNodeTitle(revision));
            commitNode.setAttribute("id", "node-" + revision.getRevisionIdShort());
          }

          nodeGroupElement.appendChild(commitNode);
        } else {
          var nodeBuilder = getBuilderByElement(nodeGroupElement, buildersIndex);
          var nodeMoveX = calculateOffsetLeft(nodePosition);
          var nodeMoveY = getOffsetTop(rowIdx);
          moveTo(nodeMoveX, nodeMoveY, nodeBuilder);
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

        var edgeGroupElement = getGroupByColor(edgeColor, false, null, nodeGroupIndex); // Make sure the node colors are
        var className = edgeGroupElement.getAttribute("class");                         // consistent with edge colors.
        if (!isSolid) {
          edgeGroupElement = getGroupByColor(edgeColor, false, className + " revision-graph__dashed", dashedEdgeGroupIndex);
        } else {
          edgeGroupElement = getGroupByColor(edgeColor, false, className, solidEdgeGroupIndex);
        }
        var edgeBuilder = getBuilderByElement(edgeGroupElement, buildersIndex);

        var edgeMoveX = calculateOffsetLeft(edgePosition);
        var edgeMoveY = getOffsetTop(rowIdx);
        moveTo(edgeMoveX, edgeMoveY, edgeBuilder);

        var lineX = calculateOffsetLeft(edgeToPosition);
        var lineY = getOffsetTop(isUp ? rowIdx - 1 : rowIdx + 1);
        lineTo(lineX, lineY, edgeBuilder);
      }
    }

    for (var entry in buildersIndex) {
      if (buildersIndex.hasOwnProperty(entry)) {
        var groupElement = entry.getKey();
        var builder = entry.getValue();

        if (builder.length > 0) {
          builder = builder.substring(0, builder.length - 2); // cut the last space off
          var element = createPathElement();
          element.setAttribute("d", builder);
          groupElement.appendChild(element);
        }
      }
    }
  }

  /**
   * @returns {Element}
   */
  function createNodeElement() {
    var node = createSvgElement("circle");
    node.setAttribute("class", "revision-graph__node");
    node.setAttribute("r", "4");
    return node;
  }

  /**
   * @returns {Element}
   */
  function createPathElement() {
    var line = createSvgElement("path");
    line.setAttribute("class", "revision-graph__line");
    return line;
  }

  /**
   * @param {String} name
   * @returns {Element|null}
   */
  function createSvgElement(name) {
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
  function lineTo(lineX, lineY, builder) {
    builder += 'L' + lineX + ',' + lineY + ' ';
    return builder;
  }

  /**
   * @param {Number} moveX
   * @param {Number} moveY
   * @param {String} builder
   * @returns {String}
   */
  function moveTo(moveX, moveY, builder) {
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
  function getGroupByColor(color, isAppend, classValue, groupIndex) {
    var element = groupIndex[color];
    if (element == null) {
      element = createSvgElement("g");
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
  function getBuilderByElement(element, buildersIndex) {
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
  function getNodeTitle(revision) {
    var revisionId = revision.getRevisionIdShort();
    var branchLabels = getBranchLabels(revision);
    return branchLabels.length > 0 ? revisionId + " (" + branchLabels.join(", ") + ")" : revisionId;
  }

  /**
   * @param revision
   * @returns {Array}
   */
  function getBranchLabels(revision) {
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
  function getGraphWidth() {
    return graph_ == null ? 0 : graph_.offsetWidth * POSITION_WIDTH;
  }

  /**
   * @param {Number} position
   * @returns {Number}
   */
  function calculateOffsetLeft(position) {
    return POSITION_WIDTH * position + POSITION_WIDTH / 2;
  }

  /**
   * @param {Number} nodeIndex
   * @returns {Number}
   */
  function getOffsetTop(nodeIndex) {
    var activityItemOffsetTop = offsetsCache_[nodeIndex];
    if (activityItemOffsetTop == null) {
      activityItemOffsetTop = calculateOffsetTop(nodeIndex);
      offsetsCache_[nodeIndex] = activityItemOffsetTop;
    }
    return activityItemOffsetTop;
  }

  /**
   * @param {Number} index
   * @returns {Number}
   */
  function calculateOffsetTop(index) {
    var item = $('.revision-item_revision').eq(index);
    return item.length > 0 ? parseInt(item.position().top) + parseInt(item.css('padding-top')) + 9 : 0;
  }
}
