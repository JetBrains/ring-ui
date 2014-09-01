//require("./revision-graph.scss");

define(["jquery", "Modernizr", "jquery.debounce"], // jshint ignore:line
  function($, Modernizr) {
    /**
     * @param {Element} revisionsContainer
     * @constructor
     */
    function RevisionGraph(revisionsContainer) {
      var self = this;
      this.revisionsContainer_ = revisionsContainer;
      this.svg_ = this.createSvgElement_("svg");

      // SVG is not supported
      if (this.svg_ == null) {
        return;
      }

      this.element_ = document.createElement("div");
      this.element_.className = "revision-graph";
      this.element_.appendChild(this.svg_);

      this.resizeCommand_ = $.debounce(50, function () {
        // Check width, reset offsets cache if differs
        var fullWidth = $(self.revisionsContainer_).parent().width();
        if (fullWidth !== self.fullWidth_) {
          self.fullWidth_ = fullWidth;
          self.offsetsCache_ = {};
        }

        // Check height, re-render the graph if differs
        if (self.element_.offsetHeight !== self.graphHeight_) {
          self.adjustRevisionsContainer_();
          var graphHeight = self.element_.offsetHeight;
          self.graphHeight_ = graphHeight;
          self.svg_.style.height = graphHeight + "px";
          self.render_();
        }
      });

      $(this.element_).insertBefore(revisionsContainer);

      $(window).on("resize.revisionGraph", function () {
        self.resizeCommand_();
      });
    }

    RevisionGraph.prototype.POSITION_WIDTH = 16;                          // Single position width (px)
    RevisionGraph.prototype.MAX_COLOR = 10;                               // Color map size
    RevisionGraph.prototype.ARROW_DOWN = "l0,10 l-5,-5 l5,5.5 l5,-5.5 ";  // .5 because line width is 2px
    RevisionGraph.prototype.ARROW_UP = "l0,-10 l5,5 l-5,-5.5 l-5,5.5 ";   // .5 because line width is 2px

    RevisionGraph.prototype.element_;

    /**
     *  Node types
     *  @enum {Number}
     */
    RevisionGraph.prototype.nodeTypes = { NODE: 0x01, ARROW_UP: 0x02, ARROW_DOWN: 0x02};

    /**
     * @type {Element}
     */
    RevisionGraph.prototype.revisionsContainer_;

    /**
     * @type {Element}
     */
    RevisionGraph.prototype.svg_;

    /**
     * @type {Function}
     */
    RevisionGraph.prototype.resizeCommand_;

    /**
     * Graph data
     */
    RevisionGraph.prototype.graph_;

    /**
     * Revisions data
     * @type {Array}
     */
    RevisionGraph.prototype.revisions_ = [];

    /**
     * Graph + revisions list width (px)
     * @type {Number}
     */
    RevisionGraph.prototype.fullWidth_;

    /**
     * Graph height (px)
     * @type {Number}
     */
    RevisionGraph.prototype.graphHeight_;

    /**
     * Item number to item offset map
     * @type {Object}
     */
    RevisionGraph.prototype.offsetsCache_ = {};

    RevisionGraph.prototype.setGraph = function(graph) {
      this.graph_ = graph;
    };

    RevisionGraph.prototype.setRevisions = function(revisions, append) {
      if (!append) {
        this.revisions_ = [];
      }

      this.revisions_.concat(revisions);
    };

    RevisionGraph.prototype.resize = function(force) {
      if (force) {
        this.offsetsCache_ = {};
      }

      this.resizeCommand_ && this.resizeCommand_();
    };

    // Implementation

    RevisionGraph.prototype.onUnload = function() {
      $(window).off("resize.revisionGraph");

      this.graph_ = null;
      this.revisions_ = [];
      this.offsetsCache_ = {};
    };

    RevisionGraph.prototype.adjustRevisionsContainer_ = function() {
      var graphWidth = this.getGraphWidth_();
      var marginLeft = graphWidth > 0 ? graphWidth + 8 : 0;
      this.revisionsContainer_.style.marginLeft = marginLeft + "px";
    };

    RevisionGraph.prototype.render_ = function() {
      if (this.graph_ == null) {
        return;
      }

      while (this.svg_.firstChild) {
        this.svg_.removeChild(this.svg_.firstChild);
      }

      this.svg_.style.width = this.getGraphWidth_() + "px";

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

      var rowsArray = this.graph_["rows"];
      if (rowsArray == null || rowsArray.length === 0) {
        return;
      }

      for (var rowIdx = 0; rowIdx < rowsArray.length; ++rowIdx) {
        var rowData = rowsArray[rowIdx];

        var nodesArray = rowData["nodes"];
        if (nodesArray == null || nodesArray.length === 0) {
          continue;
        }
        for (var j = 0; j < nodesArray.length; ++j) {
          var nodeData = nodesArray[j];
          var nodePosition = nodeData["position"];
          var nodeColor = nodeData["color"];
          var nodeType = nodeData["type"];

          var nodeGroupElement = this.getGroupByColor_(nodeColor, true, null, nodeGroupIndex);
          if (nodeType === this.nodeTypes.NODE) {
            var commitNode = this.createNodeElement_();
            commitNode.setAttribute("cx", this.calculateOffsetLeft_(nodePosition).toString());
            commitNode.setAttribute("cy", this.getOffsetTop_(rowIdx).toString());

            if (this.revisions_.length > rowIdx) {
              var revision = this.revisions_[rowIdx];
              commitNode.setAttribute("title", this.getNodeTitle_(revision));
              commitNode.setAttribute("id", "node-" + revision.getRevisionIdShort());
            }

            nodeGroupElement.appendChild(commitNode);
          } else {
            var nodeBuilder = this.getBuilderByElement_(nodeGroupElement, buildersIndex);
            var nodeMoveX = this.calculateOffsetLeft_(nodePosition);
            var nodeMoveY = this.getOffsetTop_(rowIdx);
            this.moveTo_(nodeMoveX, nodeMoveY, nodeBuilder);
            nodeBuilder.append(nodeType === this.nodeTypes.ARROW_DOWN ? this.ARROW_DOWN : this.ARROW_UP);
          }
        }

        var edgesArray = rowData["edges"];
        if (edgesArray == null || edgesArray.length === 0) {
          continue;
        }
        for (var k = 0; k < edgesArray.length; ++k) {
          var edgeData = edgesArray[k];
          var edgePosition = edgeData["position"];
          var edgeToPosition = edgeData["toPosition"];
          var edgeColor = edgeData["color"];

          var isUp = edgeData["isUp"];
          var isSolid = edgeData["isSolid"];

          var edgeGroupElement = this.getGroupByColor_(edgeColor, false, null, nodeGroupIndex); // Make sure the node colors are
          var className = edgeGroupElement.getAttribute("class");                               // consistent with edge colors.
          if (!isSolid) {
            edgeGroupElement = this.getGroupByColor_(edgeColor, false, className + " revision-graph__dashed", dashedEdgeGroupIndex);
          } else {
            edgeGroupElement = this.getGroupByColor_(edgeColor, false, className, solidEdgeGroupIndex);
          }
          var edgeBuilder = this.getBuilderByElement_(edgeGroupElement, buildersIndex);

          var edgeMoveX = this.calculateOffsetLeft_(edgePosition);
          var edgeMoveY = this.getOffsetTop_(rowIdx);
          this.moveTo_(edgeMoveX, edgeMoveY, edgeBuilder);

          var lineX = this.calculateOffsetLeft_(edgeToPosition);
          var lineY = this.getOffsetTop_(isUp ? rowIdx - 1 : rowIdx + 1);
          this.lineTo_(lineX, lineY, edgeBuilder);
        }
      }

      for (var groupElement in buildersIndex) {
        if (buildersIndex.hasOwnProperty(groupElement)) {
          var builder = buildersIndex[groupElement];

          if (builder.length > 0) {
            builder = builder.substring(0, builder.length - 2); // cut the last space off
            var element = this.createPathElement_();
            element.setAttribute("d", builder);
            groupElement.appendChild(element);
          }
        }
      }
    };

    /**
     * @returns {Element}
     */
    RevisionGraph.prototype.createNodeElement_ = function() {
      var node = this.createSvgElement_("circle");
      node.setAttribute("class", "revision-graph__node");
      node.setAttribute("r", "4");
      return node;
    };

    /**
     * @returns {Element}
     */
    RevisionGraph.prototype.createPathElement_ = function() {
      var line = this.createSvgElement_("path");
      line.setAttribute("class", "revision-graph__line");
      return line;
    };

    /**
     * @param {String} name
     * @returns {Element|null}
     */
    RevisionGraph.prototype.createSvgElement_ = function(name) {
      if (!Modernizr.svg) {
        return null;
      }
      return document.createElementNS("http://www.w3.org/2000/svg", name);
    };

    /**
     * @param {Number} lineX
     * @param {Number} lineY
     * @param {String} builder
     * @returns {String}
     */
    RevisionGraph.prototype.lineTo_ = function(lineX, lineY, builder) {
      builder += "L" + lineX + "," + lineY + " ";
      return builder;
    };

    /**
     * @param {Number} moveX
     * @param {Number} moveY
     * @param {String} builder
     * @returns {String}
     */
    RevisionGraph.prototype.moveTo_ = function(moveX, moveY, builder) {
      builder += "M" + moveX + "," + moveY + " ";
      return builder;
    };

    /**
     * @param {String} color
     * @param {Boolean} isAppend
     * @param {String} classValue
     * @param {Number} groupIndex
     * @returns {Element}
     */
    RevisionGraph.prototype.getGroupByColor_ = function(color, isAppend, classValue, groupIndex) {
      var element = groupIndex[color];
      if (element == null) {
        element = this.createSvgElement_("g");
        element.setAttribute("class", classValue != null ? classValue : "revision-graph__group_" + (Object.keys(groupIndex).length % this.MAX_COLOR));
        groupIndex[color] = element;
        if (isAppend) {
          this.svg_.appendChild(element);
        } else {
          this.svg_.insertBefore(element, this.svg_.firstChild);
        }
      }
      return element;
    };

    /**
     * @param {Element} element
     * @param buildersIndex
     * @returns {String}
     */
    RevisionGraph.prototype.getBuilderByElement_ = function(element, buildersIndex) {
      var builder = buildersIndex[element];
      if (builder == null) {
        builder = "";
        buildersIndex[element] = builder;
      }
      return builder;
    };

    /**
     * @param revision
     * @returns {String}
     */
    RevisionGraph.prototype.getNodeTitle_ = function(revision) {
      var revisionId = revision.getRevisionIdShort();
      var branchLabels = this.getBranchLabels_(revision);
      return branchLabels.length > 0 ? revisionId + " (" + branchLabels.join(", ") + ")" : revisionId;
    };

    /**
     * @param revision
     * @returns {Array}
     */
    RevisionGraph.prototype.getBranchLabels_ = function(revision) {
      var branchAvailability = revision.getBranchAvailability();
      if (branchAvailability != null) {
        var branches = [];
        for (var i = 0; i < branchAvailability.length; i++) {
          branches.push(branchAvailability[i]);
        }
        return branches;
      }
      return [];
    };

    /**
     * @returns {Number}
     */
    RevisionGraph.prototype.getGraphWidth_ = function() {
      return this.graph_ == null ? 0 : this.graph_.offsetWidth * this.POSITION_WIDTH;
    };

    /**
     * @param {Number} position
     * @returns {Number}
     */
    RevisionGraph.prototype.calculateOffsetLeft_ = function(position) {
      return this.POSITION_WIDTH * position + this.POSITION_WIDTH / 2;
    };

    /**
     * @param {Number} nodeIndex
     * @returns {Number}
     */
    RevisionGraph.prototype.getOffsetTop_ = function(nodeIndex) {
      var revisionItemOffsetTop = this.offsetsCache_[nodeIndex];
      if (revisionItemOffsetTop == null) {
        revisionItemOffsetTop = this.calculateOffsetTop_(nodeIndex);
        this.offsetsCache_[nodeIndex] = revisionItemOffsetTop;
      }
      return revisionItemOffsetTop;
    };

    /**
     * @param {Number} index
     * @returns {Number}
     */
    RevisionGraph.prototype.calculateOffsetTop_ = function(index) {
      var revisionItem = $(".revision-item_revision").eq(index);
      return revisionItem.length > 0 ? parseInt(revisionItem.position().top) + parseInt(revisionItem.css("padding-top")) + 9 : 0;
    };

    return RevisionGraph;
  });
