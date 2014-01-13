/**
 * @fileoverview
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'selectable-list/selectable-list__item',
  'diff/diff__tools',
  'jquery'
], function(SelectableListItem, d, $) {
  /**
   * @param {Element} element
   * @param {boolean=} opt_deselectOnOutsideClick
   * @constructor
   */
  var SelectableList = function(element, opt_deselectOnOutsideClick) {
    /**
     * @type {jQuery}
     * @private
     */
    this.eventHandler_ = $({});

    this.deselectOnOutsideClick_ = Boolean(opt_deselectOnOutsideClick);

    this.setElement(element);

    this.lastSelectedItem_ = 0;
  };

  /**
   * @enum {string}
   */
  SelectableList.Selector = {
    ITEM: '.selectable-list__item'
  };

  /**
   * @enum {string}
   */
  SelectableList.EventType = {
    DESELECT: 'deselect',
    DESELECT_ALL: 'deselectall',
    SELECT: 'select',
    SELECT_ALL: 'selectall'
  };

  /**
   * @type {boolean}
   * @private
   */
  SelectableList.prototype.deselectOnOutsideClick_ = false;

  /**
   * @type {Element}
   * @private
   */
  SelectableList.prototype.element_ = null;

  /**
   * @type {Array.<SelectableListItem>}
   * @private
   */
  SelectableList.prototype.items_ = [];

  /**
   * @type {Array.<number>}
   * @private
   */
  SelectableList.prototype.clickHistory_ = [];

  /**
   * @type {number?}
   * @private
   */
  SelectableList.prototype.lastSelectedItem_ = null;

  /**
   * @param {SelectableListItem} item
   * @param {boolean=} opt_render
   */
  SelectableList.prototype.addItem = function(item, opt_render) {
    if (this.items_.indexOf(item) > -1) {
      return;
    }

    this.items_.push(item);

    if (opt_render) {
      this.element_.appendChild(this.items_.getElement());
    }
  };

  /**
   * @param {SelectableListItem} item
   * @param {boolean=} opt_dispose
   */
  SelectableList.prototype.removeItem = function(item, opt_dispose) {
    if (this.items_.indexOf(item) === -1) {
      return;
    }

    opt_dispose = Boolean(opt_dispose);

    d.deleteFromArray(this.items_, item);

    if (opt_dispose) {
      item.dispose();
    }
  };

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  SelectableList.prototype.onDocumentClick_ = function(evt) {
    if (!this.element_.contains(evt.target)) {
      this.setAllSelected(false);
    }
  };

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  SelectableList.prototype.onItemMouseOver_ = function(evt) {
    evt.preventDefault();

    var hoveredElement = evt.currentTarget;
    var hoveredItem = this.getItemByElement_(hoveredElement);

    if (hoveredItem) {
      hoveredItem.setState(SelectableListItem.State.HOVERED, true);
    }
  };

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  SelectableList.prototype.onItemMouseOut_ = function(evt) {
    evt.preventDefault();

    var hoveredElement = evt.currentTarget;
    var hoveredItem = this.getItemByElement_(hoveredElement);

    if (hoveredItem) {
      hoveredItem.setState(SelectableListItem.State.HOVERED, false);
    }
  };

  /**
   * @param {jQuery.Event} evt
   * @private
   */
  SelectableList.prototype.onItemClick_ = function(evt) {
    evt.preventDefault();

    var clickedElement = evt.currentTarget;
    var clickedItem = this.getItemByElement_(clickedElement);

    if (clickedItem) {
      var clickedItemIsSelected = clickedItem.hasState(
          SelectableListItem.State.SELECTED);

      if (evt.shiftKey) {
        var itemFrom = this.getItemAt(
            !d.isNull(this.lastSelectedItem_) ? this.lastSelectedItem_ : 0);
        this.setRangeSelected(itemFrom, clickedItem, true);
      } else if (evt.ctrlKey || evt.metaKey) {
        this.setItemSelected(clickedItem, !clickedItemIsSelected);
      } else {
        this.setAllSelected(false);
        this.setItemSelected(clickedItem, !clickedItemIsSelected);
      }
    }
  };

  /**
   * @param {SelectableListItem} item
   * @param {boolean} selected
   */
  SelectableList.prototype.setItemSelected = function(item, selected) {
    var itemIndex = this.items_.indexOf(item);

    if (itemIndex === -1) {
      return;
    }

    item.setState(SelectableListItem.State.SELECTED, selected);

    if (selected) {
      this.clickHistory_.push(itemIndex);
      this.lastSelectedItem_ = itemIndex;
    } else {
      d.deleteFromArrayAt(this.clickHistory_, this.clickHistory_.length - 1);
      this.lastSelectedItem_ = d.peekArray(this.clickHistory_) || 0;
    }
  };

  /**
   * @param {boolean} selected
   */
  SelectableList.prototype.setAllSelected = function(selected) {
    for (var i = 0, l = this.items_.length; i < l; i++) {
      var currentItem = this.items_[i];
      currentItem.setState(SelectableListItem.State.SELECTED, selected);
    }

    if (selected) {
      this.lastSelectedItem_ = this.items_.length - 1;
    } else {
      this.lastSelectedItem_ = null;
    }

    this.eventHandler_.trigger(selected ?
        SelectableList.EventType.SELECT_ALL :
        SelectableList.EventType.DESELECT_ALL);
  };

  /**
   * @param {SelectableListItem} from
   * @param {SelectableListItem} to
   * @param {boolean} selected
   */
  SelectableList.prototype.setRangeSelected = function(from, to, selected) {
    if (this.items_.length === 0) {
      return;
    }

    var fromIndex = this.items_.indexOf(from);
    var toIndex = this.items_.indexOf(to);

    if (fromIndex === -1) {
      fromIndex = 0;
    }

    if (toIndex === -1) {
      toIndex = this.items_.length - 1;
    }

    var currentItem, i;

    if (fromIndex > toIndex) {
      for (i = fromIndex; i >= toIndex; i--) {
        currentItem = this.items_[i];
        this.setItemSelected(currentItem, selected);
      }
    } else {
      for (i = fromIndex; i <= toIndex; i++) {
        currentItem = this.items_[i];
        this.setItemSelected(currentItem, selected);
      }
    }
  };

  /**
   * @return {Element}
   */
  SelectableList.prototype.getElement = function() {
    return this.element_;
  };

  /**
   * @param {Element} element
   */
  SelectableList.prototype.setElement = function(element) {
    if (this.element_ === element) {
      return;
    }

    this.element_ = element;

    if (this.deselectOnOutsideClick_) {
      this.onDocumentClick_ = d.bindContext(this.onDocumentClick_, this);
      $(document).on('click', this.onDocumentClick_);
    }

    this.onItemMouseOver_ = d.bindContext(this.onItemMouseOver_, this);
    this.onItemMouseOut_ = d.bindContext(this.onItemMouseOut_, this);
    this.onItemClick_ = d.bindContext(this.onItemClick_, this);

    $(this.element_).on('mouseover', SelectableList.Selector.ITEM,
        this.onItemMouseOver_);
    $(this.element_).on('mouseout', SelectableList.Selector.ITEM,
        this.onItemMouseOut_);
    $(this.element_).on('click', SelectableList.Selector.ITEM,
        this.onItemClick_);
  };

  /**
   * @param {Element} element
   * @return {SelectableListItem}
   * @private
   */
  SelectableList.prototype.getItemByElement_ = function(element) {
    var items = this.items_;
    var selectedItem = null;

    for (var i = 0, l = items.length; i < l; i++) {
      var currentItem = items[i];
      if (currentItem.getElement() === element) {
        selectedItem = currentItem;
        break;
      }
    }

    return selectedItem;
  };

  /**
   * @param {number} index
   * @return {SelectableListItem}
   */
  SelectableList.prototype.getItemAt = function(index) {
    return this.items_[index];
  };

  /**
   * @return {Array.<SelectableListItem>}
   */
  SelectableList.prototype.getItems = function() {
    return this.items_;
  };

  /**
   * Component disposal.
   */
  SelectableList.prototype.dispose = function() {
    this.eventHandler_.off();
    this.eventHandler_ = null;

    $(this.element_).off('mouseover');
    $(this.element_).off('mouseout');
    $(this.element_).off('click');

    this.element_.innerHTML = '';
    this.element_ = null;

    delete this.deselectOnOutsideClick_;

    if (this.deselectOnOutsideClick_) {
      $(document).off('click', this.onDocumentClick_);
    }
  };

  /**
   * Creates new instance of {@code SelectableList} based on existing
   * DOM-element.
   * @param {Element} element
   * @param {boolean=} opt_closeOnOuterClick
   * @return {SelectableList}
   */
  SelectableList.decorate = function(element, opt_closeOnOuterClick) {
    var selectableList = new SelectableList(element, opt_closeOnOuterClick);
    var DOMItems = $(SelectableList.Selector.ITEM, element);

    for (var i = 0, l = DOMItems.length; i < l; i++) {
      var currentItem = new SelectableListItem.decorate(DOMItems[i]);
      selectableList.addItem(currentItem, false);
    }

    return selectableList;
  };

  return SelectableList;
});