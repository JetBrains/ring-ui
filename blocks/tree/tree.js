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
    this.fileSelector_ = '.ring-tree__item-filename';
    this.dirSelector_ = '.ring-tree__item-direname';
    this.options_ = options || { message: 'List is empty' };
    this.$containerEl = $('<div class="ring-treeContainer">');
    this.prepare();
  };

  Tree.TEMPLATE = {
    LIST: 'tree',
    LIST_ITEM: 'tree__item',
    EMPTY: 'tree-empty'
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
    var i, l, j, jl, refreshList = [];

    if (list.path) {
      refreshList[list];
    }

    else if (!list || list.length === 0) {
      return;
    }

    else if (list.length) {
      refreshList = list;
    }

    for (i=0, l=refreshList.length; i<l; i++) {
      for (j=0, jl=this.list_.length; j<jl; j++) {
        if (this.list_[j].path === refreshList[i].path) {
          this.list_[j] = refreshList[i];
        }
      }
    }

    this.prepare();
    this.render();
  };

  Tree.prototype.clear = function () {
    this.list_ = [];
    this.tree_ = null;

    this.render();
  };

  Tree.prototype.getDirItems = function ($el) {
    var $els = $el.find('.ring-tree__item-file'),
        items = $els.map(function (i, el) {
          return $(el).data('item').value;
        });
    return items;
  };

  Tree.prototype.render = function () {
    var listTpl = this.options_.listTemplate || Handlebars.partials[Tree.TEMPLATE.LIST],
        listItemTpl = this.options_.listItemTemplate || Handlebars.partials[Tree.TEMPLATE.LIST_ITEM],
        self = this;

    var $rootEl = this.$el,
        cache = this.cache_;

    if (!this.tree_) {
      var emptyTpl = this.options_.emptyTemplate || Handlebars.partials[Tree.TEMPLATE.EMPTY],
          $el = $(emptyTpl(this.options_));

      if ($rootEl) {
        $rootEl.replaceWith($el);
      }

      this.$el = $el;
      this.$containerEl.html('').append(this.$el);

      return this.$containerEl;
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

        item.$el.on('click', function (e) {
          self.onDirClick_(e, item.$el);
        });
      } else {
        item.$el.data('item', item);

        item.$el.on('click', function (e) {
          self.onFileClick_(e, item.$el);
        });
      }

      arr.$el.append(item.$el);
    });

    this.$el = this.tree_.$el;

    if ($rootEl) {
      $rootEl.replaceWith(this.$el);
    }

    this.$containerEl.append(this.$el);

    if (this.options_.onRender) {
      this.options_.onRender(this);
    }

    return this.$containerEl;
  };

  Tree.prototype.onDirClick_ = function (e, $el) {
    if (!$(e.target).hasClass('ring-tree__item-dirname')) {
      return;
    }

    e.stopPropagation();
    var state = this.cache_[$el.data('name') + ':dir'];
    state.opened = !state.opened;
    $el.toggleClass('ring-tree__item-dir--opened');

    if (this.options_.onDirClick) {
      this.options_.onDirClick($el);
    }
  };

  Tree.prototype.onFileClick_ = function (e, $el) {
    if (!$(e.target).hasClass('ring-tree__item-filename')) {
      return;
    }

    e.stopPropagation();

    if (this.options_.onFileClick) {
      this.options_.onFileClick($el, $el.data('item').value);
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
