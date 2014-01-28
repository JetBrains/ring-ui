define([
  'global/global__modules',
  'handlebars',
  'jquery'
], function (Module, Handlebars, $) {

  'use strict';

  var Tree = function (list, options) {
    this.options = options || {
      message: 'No changes. Start editing your files.'
    };
    this.prepareList(list);
  };

  Tree.TEMPLATE = {
    LIST: 'tree',
    LIST_ITEM: 'tree__item',
    EMPTY: 'tree-empty'
  };

  Tree.SELECTOR = {
    FILE: '.ring-tree__item-file',
    DIR: '.ring-tree__item-dir'
  };

  Tree.prototype.prepareList = function (list) {
    var tree = {},
        addNode,
        i, l;

    if (!list || list.length === 0) {
      this.tree_ = null;
      return;
    }

    addNode = function (obj) {
      var splitPath = obj.path.replace(/^\/|\/$/g, '').split('/'),
          curTree = tree,
          i, l, node;

      for (i=0, l=splitPath.length; i<l; i++) {
        node = {
          name: splitPath[i],
          type: 'dir'
        };

        if (i === splitPath.length - 1) {
          node.type = 'file';
          node.value = obj;
        }

        curTree[splitPath[i]] = curTree[splitPath[i]] || node;
        curTree[splitPath[i]].children = curTree[splitPath[i]].children || {};

        curTree = curTree[splitPath[i]].children;
      }
    };

    for (i=0, l=list.length; i<l; i++) {
      addNode(list[i]);
    }

    this.tree_ = tree;
  };

  Tree.prototype.createDOM = function () {
    if (this.tree_) {
      this.element_ = this.render(this.tree_);

      var self = this;

      $(this.element_).on('click', Tree.SELECTOR.DIR, function (e) {
        self.onDirClick_(e);
      });

      $(this.element_).on('click', Tree.SELECTOR.FILE, function (e) {
        self.onFileClick_(e);
      });
    }

    else {
      this.element_ = document.createElement('div');
      this.element_.innerHTML = Handlebars.partials[Tree.TEMPLATE.EMPTY](this.options);
    }

    return this.element_;
  };

  Tree.prototype.render = function (tree) {
    var ulEl, liEl,
        $ulEl, $liEl;

    if (!tree) {
      return;
    }

    $ulEl = $(Handlebars.partials[Tree.TEMPLATE.LIST]());

    var node, nodeName;

    for (nodeName in tree) {
      if ({}.hasOwnProperty.call(tree, nodeName)) {
        node = tree[nodeName];
        if (node.type === 'file') {
          $liEl = $(Handlebars.partials[Tree.TEMPLATE.LIST_ITEM](node));
          $ulEl.append($liEl);
        }

        else {
          var $tmpULEl = this.render(node.children);

          if ($tmpULEl) {
            $liEl = $(Handlebars.partials[Tree.TEMPLATE.LIST_ITEM](node));
            $liEl.append($tmpULEl);
            $ulEl.append($liEl);
          }
        }
      }
    }

    return $ulEl;
  };

  Tree.prototype.onDirClick_ = function (e) {
    e.stopPropagation();
    var $dirEl = $(e.currentTarget);
    $dirEl.toggleClass('ring-tree__item-dir--opened');
    
    if (this.options.onDirClick) {
      this.options.onDirClick();
    }
  };

  Tree.prototype.onFileClick_ = function (e) {
    e.stopPropagation();

    if (this.options.onFileClick) {
      this.options.onFileClick();
    }
  };

  Module.add('tree', {
    getTree: {
      method: function () {
        return Tree;
      },
      override: true
    }
  });

  return Tree;

});
