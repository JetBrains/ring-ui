define([
  'global/global__modules',
  'global/global__utils',
  'handlebars',
  'jquery'
], function (Module, utils, Handlebars, $) {
  
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
          curTree = tree,
          sumPath = '';

      for (i=0, l=path.length; i<l; i++) {
        partPath = path[i];

        sumPath += '/' + partPath;
        
        node = {
          name: partPath,
          parentPath: sumPath,
          type: i === (l-1) ? 'file' : 'dir',
          uuid: utils.uuid()
        };

        if (node.type === 'dir' && !cache[node.parentPath + ':' + node.type]) {
          cache[node.parentPath + ':' + node.type] = { opened: false, focused: false };
        } else if (node.type === 'file' && !cache[node.parentPath + ':' + node.type]) {
          cache[node.parentPath + ':' + node.type] = { focused: false };
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
      refreshList.push(list);
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

  Tree.prototype.getTreeItems = function (uuid) {
    var $treeEl = this.$containerEl.find('[data-uuid="' + uuid + '"]'),
        $items;

    if (!$treeEl || $treeEl.length === 0) {
      return;
    }

    $items = $treeEl.find('.ring-tree__item-file');

    return $items.map(function (index, el) { return $(el).data('item').value; });
  };

  Tree.prototype.getItemValue = function (uuid) {
    var $el = this.$containerEl.find('[data-uuid="' + uuid + '"]');

    if (!$el || $el.length === 0) {
      return;
    }

    return $el.data('item').value;
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

    var $focusedEl;

    traverse(this.tree_, function (item, index, arr) {
      if (!arr.$el) {
        arr.$el = $(listTpl());
      }

      var state = cache[item.parentPath + ':' + item.type];

      item.$el = $(listItemTpl(item));
      item.$el.data('parentPath', item.parentPath);
      item.$el.data('type', item.type);

      if (state.focused) {
        $focusedEl = item.$el;
      }

      if (item.type === 'dir') {
        item.children.$el = $(listTpl());
        item.$el.append(item.children.$el);

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

      var timer;
      item.$el.on('keydown', function (e) {
        var SPACE_KEY = 32,
              TAB_KEY = 9,
              UP_ARROW = 38,
              DOWN_ARROW = 40,
              $target = $(e.target);

        if ([SPACE_KEY, TAB_KEY, DOWN_ARROW, UP_ARROW].indexOf(e.keyCode) === -1) {
          return;
        }

        if (e.keyCode === TAB_KEY) {
          clearTimeout(timer);
          timer = setTimeout(function () {
            var $activeEl = document.activeElement ? $(document.activeElement).closest('[data-uuid]') : null;
            if  (!$activeEl || $activeEl.length === 0) {
              return;
            }
            self.onTabClick_(e, $activeEl);
          }, 200);
          return;
        }

        else if (e.keyCode === DOWN_ARROW) {
          self.selectNextItem_(e);
          return;
        }

        else if (e.keyCode === UP_ARROW) {
          self.selectPrevItem_(e);
          return;
        }

        if ($target.hasClass('ring-tree__item-dir')) {
          e.target = $target.find('.ring-tree__item-dirname')[0];
          self.onDirClick_(e, $target);
        }

        else if ($target.hasClass('ring-tree__item-file')) {
          e.target = $target.find('.ring-tree__item-filename')[0];
          self.onFileClick_(e, $target);
        }
      });

      item.$el.attr('data-uuid', item.uuid);

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

    if ($focusedEl) {
      $focusedEl.focus();
    }

    return this.$containerEl;
  };

  Tree.prototype.selectNextItem_ = function (e) {
    e.stopPropagation();
    var $activeEl = document.activeElement ? $(document.activeElement).closest('[data-uuid]') : null;
    if  (!$activeEl || $activeEl.length === 0) {
      return;
    }

    var activeItemUUID = $activeEl.attr('data-uuid'),
        activeItem,
        nextItem;

    traverse(this.tree_, function (item) {
      if (activeItem && !nextItem) {
        if (item.$el.is(':visible')) {
          nextItem = item;
        }
      }

      if (item.uuid === activeItemUUID) {
        activeItem = item;
      }
    });

    if (nextItem) {
      for (var name in this.cache_) {
        this.cache_[name].focused = false;
        if (name === nextItem.parentPath + ':' + nextItem.type) {
          this.cache_[name].focused = true;
        }
      }

      nextItem.$el.focus();
    }
  };

  Tree.prototype.selectPrevItem_ = function (e) {
    e.stopPropagation();

    var $activeEl = document.activeElement ? $(document.activeElement).closest('[data-uuid]') : null;
    if  (!$activeEl || $activeEl.length === 0) {
      return;
    }

    var activeItemUUID = $activeEl.attr('data-uuid'),
        activeItem,
        prevItem;

    traverse(this.tree_, function (item) {
      if (item.uuid === activeItemUUID) {
        activeItem = item;
      }

      if (!activeItem) {
        if (item.$el.is(':visible')) {
          prevItem = item;
        }
      }
    });

    if (prevItem) {
      for (var name in this.cache_) {
        this.cache_[name].focused = false;
        if (name === prevItem.parentPath + ':' + prevItem.type) {
          this.cache_[name].focused = true;
        }
      }

      prevItem.$el.focus();
    }
  };

  Tree.prototype.onTabClick_ = function (e, $activeElement) {
    e.stopPropagation();

    for (var name in this.cache_) {
      this.cache_[name].focused = false;
      if (name === $activeElement.data('parentPath') + ':' + $activeElement.data('type')) {
        this.cache_[name].focused = true;
      }
    }
  };

  Tree.prototype.onDirClick_ = function (e, $el) {
    if (!$(e.target).hasClass('ring-tree__item-dirname')) {
      return;
    }

    e.stopPropagation();
    var state = this.cache_[$el.data('parentPath') + ':dir'];
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
