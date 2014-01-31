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
    this.tree_ = null;
    this.$el = null;
    this.cache_ = {};
    this.options_ = options || { message: 'List is empty' };
    this.prepare();
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

  Tree.prototype.prepare = function () {
    if (this.list_.length === 0) {
      this.clear();
      return;
    }

    var i, l,
        tree = [],
        cache = this.cache_;

    function prepareItem (item) {
      var i, l, partPath, node,
          path = item.path.replace(/^\/|\/$/g, '').split('/'),
          curTree = tree;

      for (i=0, l=path.length; i<l; i++) {
        partPath = path[i];
        node = {
          name: partPath,
          type: i === (l-1) ? 'file' : 'dir'
        };

        if (node.type === 'dir' && !cache[node.name + ':' + node.type]) {
          cache[node.name + ':' + node.type] = { opened: false };
        }

        if (node.type === 'dir') {
          if (!curTree[partPath]) {
            curTree[partPath] = node;
            node.children = [];
            curTree.push(node);
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

    for (i=0, l=this.list_.length; i<l; i++) {
      prepareItem(this.list_[i]);
    }

    this.tree_ = tree;
  };

  Tree.prototype.add = function (list) {
    if (!list || list.length === 0) {
      return;
    }

    this.list_ = this.list_.concat(list);

    this.prepare();
    this.render();
  };

  Tree.prototype.remove = function (list) {
    if (!list || list.length === 0) {
      return;
    }

    var i, il, j, jl,
        indexes = [];

    for (i=0, il=list.length; i<il; i++) {
      for (j=0, jl=this.list_.length; j<jl; j++) {
        if (this.list_[j].path === list[i].path) {
          this.list_.splice(j, 1);
          jl -= 1;
          j -= 1;
          indexes.push(j);
        }
      }
    }

    if (indexes.length) {
      this.prepare();
      this.render();
    }
  };

  Tree.prototype.refresh = function (list) {
    var i, l;

    if (list.path) {
      for (i=0, l=this.list_.length; i<l; i++) {
        if (this.list_[i].path === list.path) {
          this.list_[i] = list;
          break;
        }
      }
    }

    else if (!list || list.length === 0) {
      return;
    }

    else if (list.length) {
      this.list_ = list;
    }

    this.prepare();
    this.render();
  };

  Tree.prototype.clear = function () {
    this.list_ = [];
    this.tree_ = null;

    this.render();
  };

  Tree.prototype.render = function () {
    var listTpl = this.options_.listTemplate || Handlebars.partials[Tree.TEMPLATE.LIST],
        listItemTpl = this.options_.listItemTemplate || Handlebars.partials[Tree.TEMPLATE.LIST_ITEM];

    var $rootEl = this.$el,
        cache = this.cache_;

    if (!this.tree_) {
      var emptyTpl = this.options_.emptyTemplate || Handlebars.partials[Tree.TEMPLATE.EMPTY],
          $el = $(emptyTpl(this.options_));

      if ($rootEl) {
        $rootEl.replaceWith($el);
      }

      this.$el = $el;

      return $el;
    }

    traverse(this.tree_, function (item, index, arr) {
      if (!arr.$el) {
        arr.$el = $(listTpl());
      }

      item.$el = $(listItemTpl(item));

      if (item.type === 'dir') {
        item.$el.data('name', item.name);
        item.children.$el = $(listTpl());
        item.$el.append(item.children.$el);

        var state = cache[item.name + ':dir'];

        if (state.opened) {
          item.$el.addClass('ring-tree__item-dir--opened');
        }
      } else {
        item.$el.data('item', item);
      }

      arr.$el.append(item.$el);
    });

    this.$el = this.tree_.$el;

    this.bindListeners();

    if ($rootEl) {
      $rootEl.replaceWith(this.$el);
    }

    return this.$el;
  };

  Tree.prototype.bindListeners = function () {
    var self = this;

    this.$el.on('click', Tree.SELECTOR.DIR, function (e) {
      self.onDirClick_(e);
    });

    this.$el.on('click', Tree.SELECTOR.FILE, function (e) {
      self.onFileClick_(e);
    });

    $(document).on('keydown', [Tree.SELECTOR.DIR, Tree.SELECTOR.FILE], function (e) {
      var SPACE_KEY = 32;

      if (e.keyCode === SPACE_KEY) {

        if ($(e.target).hasClass('ring-tree__item-dir')) {
          e.preventDefault();
          self.onDirClick_(e);
        }

        else if ($(e.target).hasClass('ring-tree__item-file')) {
          e.preventDefault();
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
      var state = this.cache_[$target.data('name') + ':dir'];
      state.opened = !state.opened;
      $target.toggleClass('ring-tree__item-dir--opened');

      if (this.options_.onDirClick) {
        this.options_.onDirClick(state.opened);
      }
    }
  };

  Tree.prototype.onFileClick_ = function (e) {
    e.stopPropagation();
    
    var $target = $(e.target).hasClass(Tree.SELECTOR.FILE.slice(1)) ?
      $(e.target) : $(e.currentTarget).hasClass(Tree.SELECTOR.FILE.slice(1)) ?
        $(e.currentTarget) : null;

    if ($target && this.options_.onFileClick) {
      this.options_.onFileClick($target.data('item').value);
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
