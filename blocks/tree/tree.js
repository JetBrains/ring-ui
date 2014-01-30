define([
  'global/global__modules',
  'handlebars',
  'jquery'
], function (Module, Handlebars, $) {

  'use strict';

  function traverse (tree, fn) {
    var stack = [{ tree: tree, index: 0 }],
        current;

    while (stack.length) {
      current = stack.pop();

      var node, index;
      for (;current.index<current.tree.length;) {
        index = current.index;
        node = current.tree[index];

        current.index += 1;

        if (node.type === 'file') {
          fn(node, index, current.tree);
        } else {
          fn(node, index, current.tree);
          stack.push(current);
          current = { tree: node.children, index: 0 };
        }
      }
    }
  }

  var Tree = function (list, options) {
    this.list_ = (list && list.length) ? list.slice(0) : [];
    this.options_ = options || {
      message: 'No files'
    };
    this.tree_ = null;
    this.prepare(list);
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

  Tree.prototype.refresh = function (list) {
    var i, l, cb,
        listItemTpl = this.options_.listItemTemplate || Handlebars.partials[Tree.TEMPLATE.LIST_ITEM];

    cb = function (item, index, arr) {
      if (item.type === 'file' && list[i].path === item.value.path) {
        item.$el.remove();

        for (var prop in list[i]) {
          if ({}.hasOwnProperty.call(list[i], prop)) {
            item.value[prop] = list[i][prop];
          }
        }

        item.$el = $(listItemTpl(item));
        arr.$el.append(item.$el);
      }
    };

    for (i=0, l=list.length; i<l; i++) {
      traverse(this.tree_, cb);
    }
  };

  Tree.prototype.add = function (list) {
    var newList = (list && list.length) ? list : [];
    this.list_ = this.list_.concat(newList);
    this.prepare(newList);
    this.render();
  };

  Tree.prototype.remove = function (list) {
    var i, l, j, jl, indexes = [];

    var cb = function (item, index, arr) {
      if (item.type === 'file' && list[i].path === item.value.path) {
        item.$el.remove();
        item.$el = null;
        arr.splice(index, 1);
      }
    };

    for (i=0, l=list.length; i<l; i++) {
      traverse(this.tree_, cb);

      for (j=0, jl=this.list_; j<jl; j++) {
        if (this.list_[j].path === list[i].path) {
          indexes.push(j);
        }
      }
    }

    for (i=0, l=indexes.length; i<l; i++) {
      this.list_.splice(indexes[i], 1);
    }
  };

  Tree.prototype.prepare = function (list) {
    if (!list || list.length === 0) {
      if (!this.list_ || this.list_.length === 0) {
        this.tree_ = null;
      }
      return;
    }

    var i, l, item,
        tree = this.tree_ || [];

    function prepareItem (item) {
      var i, l,
          partPath,
          node,
          splitPath = item.path.replace(/^\/|\/$/g, '').split('/'),
          curTree = tree;

      for (i=0, l=splitPath.length; i<l; i++) {
        partPath = splitPath[i];
        node = {
          name: partPath,
          type: i === (l-1) ? 'file' : 'dir'
        };

        if (node.type === 'dir') {
          if (!curTree[partPath]) {
            curTree[partPath] = node;
            node.children = [];
            node.index = curTree.push(node) - 1;
          } else {
            node.children = curTree[partPath].children;
          }
          curTree = node.children;
        } else {
          node.value = item;
          curTree.push(node);
        }
      }
    }

    for (i=0, l=list.length; i<l; i++) {
      item = list[i];
      prepareItem(item);
    }

    this.tree_ = tree;
  };

  Tree.prototype.bindListeners = function () {
    var self = this;

    if (this.binded_) {
      return;
    }

    this.binded_ = true;

    this.tree_.$el.on('click', Tree.SELECTOR.DIR, function (e) {
      self.onDirClick_(e);
    });

    this.tree_.$el.on('click', Tree.SELECTOR.FILE, function (e) {
      self.onFileClick_(e);
    });

    this.tree_.$el.on('keydown', [Tree.SELECTOR.DIR, Tree.SELECTOR.FILE], function (e) {
      var SPACE_KEY = 32;

      if (e.keyCode === SPACE_KEY) {
        e.preventDefault();

        if ($(e.target).hasClass('ring-tree__item-dir')) {
          self.onDirClick_(e);
        }

        else if ($(e.target).hasClass('ring-tree__item-file')) {
          self.onFileClick_(e);
        }
      }
    });
  };

  Tree.prototype.onDirClick_ = function (e) {
    e.stopPropagation();

    var $target = $(e.target).hasClass(Tree.SELECTOR.DIR.slice(1)) ?
      $(e.target) : $(e.currentTarget).hasClass(Tree.SELECTOR.DIR.slice(1)) ?
        $(e.currentTarget) : null;

    if ($target) {
      $target.toggleClass('ring-tree__item-dir--opened');
    }
  };

  Tree.prototype.onFileClick_ = function (e) {
    e.stopPropagation();
  };

  Tree.prototype.render = function () {
    var listTpl = this.options_.listTemplate || Handlebars.partials[Tree.TEMPLATE.LIST],
        listItemTpl = this.options_.listItemTemplate || Handlebars.partials[Tree.TEMPLATE.LIST_ITEM];

    if (!this.tree_) {
      var emptyTpl = this.options_.emptyTemplate || Handlebars.partials[Tree.TEMPLATE.EMPTY];
      return $(emptyTpl(this.options_));
    }

    traverse(this.tree_, function (item, index, arr) {
      if (!arr.$el) {
        arr.$el = $(listTpl());
      }

      if (item.type === 'dir' && !item.$el) {
        item.$el = $(listItemTpl(item));
        item.children.$el = $(listTpl());
        item.$el.append(item.children.$el);
        arr.$el.append(item.$el);
      }

      if (item.type === 'file') {
        if (item.$el) {
          item.$el.remove();
        }

        item.$el = $(listItemTpl(item));
        arr.$el.append(item.$el);
      }
    });

    this.bindListeners();
    return this.tree_.$el;
  };

  Tree.prototype.clear = function () {
    traverse(this.tree_, function (item, index, arr) {
      if (item.$el) {
        item.$el.remove();
        item.$el = null;
      }

      if (arr.$el) {
        arr.$el.remove();
        arr.$el = null;
      }
    });
    this.binded_ = false;
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
