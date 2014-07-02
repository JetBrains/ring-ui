function RevisionGraph() {
  var POSITION_WIDTH = 16;                          // Single position width (px)
  var MAX_COLOR = 10;
  var ARROW_DOWN = "l0,10 l-5,-5 l5,5.5 l5,-5.5 ";  // .5 because line width is 2px
  var ARROW_UP = "l0,-10 l5,5 l-5,-5.5 l-5,5.5 ";   // .5 because line width is 2px

  var nodeTypes = { NODE: 0x01, UP_ARROW: 0x02, DOWN_ARROW: 0x02};

  // Elements
  var myRevisionsContainer;
  var mySvg;

  // Adaptive UI: window resize support
  var myResizeCommand;
  var myWindowResizeHandler;
  var myResizeEventHandler;

  var myGraph;
  var myRevisions = [];

  // Graph + revisions list width (px)
  var myFullWidth;
  // Graph height (px)
  var myGraphHeight;
  // Item number to item offset map
  var myOffsetsCache = {};

  function RevisionGraph(revisionsContainer, eventBus) {
    myRevisionsContainer = revisionsContainer;
    mySvg = createSvgElement("svg");

    // SVG is not supported
    if (mySvg == null) {
      return;
    }

    setStyleName("revision-graph");
    getElement().appendChild(mySvg);

    myResizeCommand = $.debounce(function() {
      // Check width, reset offsets cache if differs
      var fullWidth = myRevisionsContainer.getParent().getOffsetWidth();
      if (fullWidth != myFullWidth) {
        myFullWidth = fullWidth;
        myOffsetsCache = {};
      }

      // Check height, re-render the graph if differs
      if (getElement().getOffsetHeight() != myGraphHeight) {
        adjustRevisionsContainer();
        var graphHeight = getElement().getOffsetHeight();
        myGraphHeight = graphHeight;
        mySvg.getStyle().setHeight(graphHeight);
        render();
      }
    }, 50, false);

    myWindowResizeHandler = $(window).resize(function() {
        myResizeCommand();
    });

    myResizeEventHandler = function() {
      resize(true);
    };
  }

  function setGraph(graph) {
    myGraph = graph;
  }

  function setRevisions(revisions, append) {
    if (!append) {
      myRevisions = [];
    }

    myRevisions.concat(revisions);
  }

  function resize(force) {
    if (force) {
      myOffsetsCache = {};
    }
    if (myResizeCommand != null) {
      myResizeCommand();
    }
  }

  // Implementation

  function onUnload() {
    if (myWindowResizeHandler != null) {
      myWindowResizeHandler.removeHandler();
      myWindowResizeHandler = null;
    }

    if (myResizeEventHandler != null) {
      myResizeEventHandler.removeHandler();
      myResizeEventHandler = null;
    }

    myGraph = null;
    myRevisions = [];
    myOffsetsCache = {};
  }

  function adjustRevisionsContainer() {
    var graphWidth = getGraphWidth();
    var marginLeft = graphWidth > 0 ? graphWidth + 8 : 0;
    myRevisionsContainer.getElement().getStyle().setProperty("marginLeft", marginLeft);
  }

  function render() {
    if (myGraph == null) {
      return;
    }

    mySvg.removeAllChildren();
    mySvg.getStyle().setWidth(getGraphWidth());

    var nodeGroupIndex = {}; // int, element
    var solidEdgeGroupIndex = {}; // int, element
    var dashedEdgeGroupIndex = {}; // int, element
    var buildersIndex = {}; // element, string

    var rowsArray = myGraph.getRowsArray();
    if (rowsArray == null || rowsArray.length == 0) { return; }
    for (var rowIdx = 0; rowIdx < rowsArray.length; ++rowIdx) {
      var rowDTO = rowsArray[rowIdx];

      var nodesArray = rowDTO.getNodesArray();
      if (nodesArray == null || nodesArray.length == 0) { continue; }
      for (var j = 0; j < nodesArray.length; ++j) {
        var nodeDTO = nodesArray[j];
        var position = nodeDTO.getPosition();
        var color = nodeDTO.getColor();
        var type = nodeDTO.getType();

        var groupElement = getGroupByColor(color, true, null, nodeGroupIndex);
        if (type == nodeTypes.NODE) {
          var commitNode = createNodeElement();
          commitNode.setAttribute("cx", calculateOffsetLeft(position));
          commitNode.setAttribute("cy", getOffsetTop(rowIdx));

          if (myRevisions.length > rowIdx) {
            var revision = myRevisions[rowIdx];
            commitNode.setAttribute("title", getNodeTitle(revision));
            commitNode.setAttribute("id", "node-" + revision.getRevisionIdShort());
          }

          groupElement.appendChild(commitNode);
        } else {
          var builder = getBuilderByElement(groupElement, buildersIndex);
          var moveX = calculateOffsetLeft(position);
          var moveY = getOffsetTop(rowIdx);
          moveTo(moveX, moveY, builder);
          builder.append(type == nodeTypes.DOWN_ARROW ? ARROW_DOWN : ARROW_UP);
        }
      }

      var edgesArray = rowDTO.getEdgesArray();
      if (edgesArray == null || edgesArray.length == 0) { continue; }
      for (var k = 0; k < edgesArray.length; ++k) {
        var edgeDTO = edgesArray[k];
        var position = edgeDTO.getPosition();
        var toPosition = edgeDTO.getToPosition();
        var isUp = edgeDTO.getIsUp();
        var color = edgeDTO.getColor();
        var isSolid = edgeDTO.getIsSolid();

        var groupElement = getGroupByColor(color, false, null, nodeGroupIndex); // Make sure the node colors are
        var className = groupElement.getAttribute("class");                     // consistent with edge colors.
        if (!isSolid) {
          groupElement = getGroupByColor(color, false, className + " revision-graph__dashed", dashedEdgeGroupIndex);
        } else {
          groupElement = getGroupByColor(color, false, className, solidEdgeGroupIndex);
        }
        var builder = getBuilderByElement(groupElement, buildersIndex);

        var moveX = calculateOffsetLeft(position);
        var moveY = getOffsetTop(rowIdx);
        moveTo(moveX, moveY, builder);

        var lineX = calculateOffsetLeft(toPosition);
        var lineY = getOffsetTop(isUp ? rowIdx - 1 : rowIdx + 1);
        lineTo(lineX, lineY, builder);
      }
    }

    for (var entry in buildersIndex) {
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

  function createNodeElement() {
    var node = createSvgElement("circle");
    node.setAttribute("class", "revision-graph__node");
    node.setAttribute("r", "4");
    return node;
  }

  function createPathElement() {
    var line = createSvgElement("path");
    line.setAttribute("class", "revision-graph__line");
    return line;
  }

  function createSvgElement(name){
    if (Modernizr.svg) {
      return null;
    }
    return document.createElementNS("http://www.w3.org/2000/svg", name);
   }

  function lineTo(lineX, lineY, builder) {
    builder += 'L' + lineX + ',' + lineY + ' ';
    return builder;
  }

  function moveTo(moveX, moveY, builder) {
    builder += 'M' + moveX + ',' + moveY + ' ';
    return builder;
  }

  function getGroupByColor(color, isAppend, classValue, groupIndex) {
    var element = groupIndex[color];
    if (element == null) {
      element = createSvgElement("g");
      element.setAttribute("class", classValue != null ? classValue : "revision-graph__group_" + (groupIndex.length % MAX_COLOR));
      groupIndex.put(color, element);
      if (isAppend) {
        mySvg.appendChild(element);
      } else {
        mySvg.insertFirst(element);
      }
    }
    return element;
  }

  function getBuilderByElement(element, buildersIndex) {
    var builder = buildersIndex[element];
    if (builder == null) {
      builder = "";
      buildersIndex[element] = builder;
    }
    return builder;
  }

  function getNodeTitle(revision) {
    var revisionId = revision.getRevisionIdShort();
    var branchLabels = getBranchLabels(revision);
    return branchLabels.length > 0 ? revisionId + " (" + branchLabels.join(", ") + ")" : revisionId;
  }

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

  function getGraphWidth() {
    return myGraph == null ? 0 : myGraph.offsetWidth * POSITION_WIDTH;
  }

  function calculateOffsetLeft(position) {
    return POSITION_WIDTH * position + POSITION_WIDTH / 2;
  }

  function getOffsetTop(nodeIndex) {
    var activityItemOffsetTop = myOffsetsCache[nodeIndex];
    if (activityItemOffsetTop == null) {
      activityItemOffsetTop = calculateOffsetTop(nodeIndex);
      myOffsetsCache[nodeIndex] = activityItemOffsetTop;
    }
    return activityItemOffsetTop;
  }

  function calculateOffsetTop(index) {
    var item = $('.revision-item_revision').eq(index);
    return item.length > 0 ? parseInt(item.position().top) + parseInt(item.css('padding-top')) + 9 : 0;
  }
}
