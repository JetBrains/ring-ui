define([
  'global/global__modules',
  'handlebars',
  'jquery'
], function (Module, Handlebars, $) {

  'use strict';

  var cachedNode = {};

  /**
   * @options.message {string) Text for empty tree
   * @options.emptyTemplate {Function} Handlebars template for empty state
   * @options.listTemplate {Function} Handlebars template for list container
   * @options.listItemTemplate {Function} Handlebars template for list item
   * @options.onFileClick {Function}
   * @options.onDirClick {Function}
   * @constructor
   */
  var Tree = function (list, options) {
    this.list_ = list || [];
    this.options = options || {
      message: 'Nothing to see here'
    };
    this.prepareList();
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

  Tree.prototype.add = function (list) {
    if (list && list.length) {
      if (this.tree_) {
        this.list_ = this.list_.concat(list);
      }

      else {
        this.list_ = list;
      }
    }

    this.prepareList();
    var $el = this.element_;
    this.createDOM();
    $el.replaceWith(this.element_);
  };

  Tree.prototype.remove = function (list) {
    var i, li, j, lj;

    if (!list || list.length === 0) {
      return;
    }

    for (i=0, li=list.length; i<li; i++) {
      for (j=0, lj=this.list_.length; j<lj; j++) {
        if (list[i].path === this.list_[j].path) {
          this.list_[j].deleted = true;
        }
      }
    }

    this.prepareList();
    var $el = this.element_;
    this.createDOM();
    $el.replaceWith(this.element_);
  };

  Tree.prototype.prepareList = function () {
    var tree = {},
        addNode,
        i, l;

    if (!this.list_ || this.list_.length === 0) {
      this.tree_ = null;
      return;
    }

    addNode = function (obj) {
      var splitPath = obj.path.replace(/^\/|\/$/g, '').split('/'),
          curTree = tree,
          prevTree,
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

        var nodeId = [node.type, ':', node.name].join(''),
            cNode = cachedNode[nodeId];
        if (cNode) {
          node = cNode;
        }

        else {
          cachedNode[nodeId] = node;
        }

        curTree[splitPath[i]] = curTree[splitPath[i]] || node;
        curTree[splitPath[i]].children = curTree[splitPath[i]].children || {};

        if (obj.deleted && node.type === 'file') {
          delete curTree[node.name];
          continue;
        }

        prevTree = curTree;
        curTree = curTree[splitPath[i]].children;
      }

      obj.node = node;
    };

    for (i=0, l=this.list_.length; i<l; i++) {
      addNode(this.list_[i]);
    }

    this.tree_ = tree;
  };

  Tree.prototype.addListeners_ = function () {
    var self = this;

    $(this.element_).on('click', Tree.SELECTOR.DIR, function (e) {
      self.onDirClick_(e, e.currentTarget);
    });

    $(this.element_).on('click', Tree.SELECTOR.FILE, function (e) {
      self.onFileClick_(e, e.currentTarget);
    });

    $(this.element_).on('keydown', [Tree.SELECTOR.DIR, Tree.SELECTOR.FILE], function (e) {
      var SPACE_KEY = 32;

      if (e.keyCode === SPACE_KEY) {
        e.preventDefault();

        if ($(e.target).hasClass('ring-tree__item-dir')) {
          self.onDirClick_(e, e.target);
        }

        else if ($(e.target).hasClass('ring-tree__item-file')) {
          self.onFileClick_(e, e.target);
        }
      }
    });
  };

  Tree.prototype.createDOM = function () {
    var template;

    if (this.tree_) {
      this.element_ = this.render(this.tree_);
      this.addListeners_();
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
        $tmpULEl,
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
          $tmpULEl = this.render(node.children);

          if ($tmpULEl) {
            $liEl = $(listItemTpl(node));
            $liEl.data('node', node);
            $liEl.data('tree', $tmpULEl);
            $ulEl.append($liEl);

            if (node.opened) {
              this.toggleDir($liEl);
            }
          }
        }
      }
    }

    return $ulEl;
  };

  Tree.prototype.onDirClick_ = function (e, dirEl) {
    var $dirEl = $(dirEl),
        node = $dirEl.data('node');

    if ($(e.target).closest('.ring-tree__item-dir')[0] !== dirEl) {
      return;
    }

    node.opened = !node.opened;

    this.toggleDir($dirEl);

    if (this.options.onDirClick) {
      this.options.onDirClick(node);
    }
  };

  Tree.prototype.toggleDir = function ($dirEl) {
    var tree = $dirEl.data('tree');
    if (tree) {
      $dirEl.removeData('tree');
      $dirEl.append(tree);
    }
    
    $dirEl.toggleClass('ring-tree__item-dir--opened');
  };

  Tree.prototype.onFileClick_ = function (e, fileEl) {
    var $fileEl = $(fileEl),
        node = $fileEl.data('node');

    if ($(e.target).closest('.ring-tree__item-file')[0] !== fileEl) {
      return;
    }

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
