define([
  'global/global__modules',
  'handlebars',
  'jquery'
], function (Module, Handlebars, $) {

  'use strict';

  var Tree = function (list, options) {
    this.options = options || {
      message: 'Nothing to see here'
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
    var template;

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
      template = this.options.emptyTemplate || Handlebars.partials[Tree.TEMPLATE.EMPTY];
      this.element_ = $('<div class="ring-tree">');
      this.element_[0].innerHTML = template(this.options);
    }

    return this.element_;
  };

  Tree.prototype.render = function (tree) {
    var $ulEl, $liEl,
        listTpl, listItemTpl;

    if (!tree) {
      return;
    }

    listTpl = this.options.listTemplate || Handlebars.partials[Tree.TEMPLATE.LIST];
    listItemTpl = this.options.listItemTemplate || Handlebars.partials[Tree.TEMPLATE.LIST_ITEM];

    $ulEl = $(listTpl());

    var node, nodeName;

    for (nodeName in tree) {
      if ({}.hasOwnProperty.call(tree, nodeName)) {
        node = tree[nodeName];

        if (node.type === 'file') {
          $liEl = $(listItemTpl(node));
          $liEl.data('node', node);
          $ulEl.append($liEl);
        }

        else {
          var $tmpULEl = this.render(node.children);

          if ($tmpULEl) {
            $liEl = $(listItemTpl(node));
            $liEl.data('node', node);
            $liEl.data('tree', $tmpULEl);
            $ulEl.append($liEl);
          }
        }
      }
    }

    return $ulEl;
  };

  Tree.prototype.onDirClick_ = function (e) {
    e.stopPropagation();

    var $dirEl = $(e.currentTarget),
        node = $dirEl.data('node'),
        tree = $dirEl.data('tree');

    if (tree) {
      $dirEl.removeData('tree');
      $dirEl.append(tree);
    }

    $dirEl.toggleClass('ring-tree__item-dir--opened');

    if (this.options.onDirClick) {
      this.options.onDirClick(node);
    }
  };

  Tree.prototype.onFileClick_ = function (e) {
    e.stopPropagation();

    var $fileEl = $(e.currentTarget),
        node = $fileEl.data('node');

    if (this.options.onFileClick) {
      this.options.onFileClick(node);
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
