import 'core-js/modules/es6.array.find';

/**
 * Selection class, catches all selection and activation operations and triggers events
 */
export default class Selection {
  constructor(items, emitEvent) {
    this.items = items;
    this.emitEvent = emitEvent;
  }

  setItems(items) {
    this.items = items;
    this.emitEvent('rgTable:itemsChanged', items);
  }

  activateItem(item) {
    this.clearActivity();
    item.active = true;
    this.emitEvent('rgTable:activateItem', item, this.items.indexOf(item));
  }

  getActiveItem() {
    if (!this.items) {
      return undefined;
    }

    return this.items.find(function (item) {
      return item.active;
    });
  }

  getActiveItemIndex() {
    return this.items.indexOf(this.getActiveItem());
  }

  setActiveItemIndex(index) {
    const item = this.items[index];
    this.activateItem(item);
  }

  activateNextItem() {
    const index = this.items.indexOf(this.getActiveItem());
    if (index >= 0 && index < this.items.length - 1) {
      const newActiveItem = this.items[index + 1];
      this.activateItem(newActiveItem);
      return newActiveItem;
    } else {
      this.clearActivity();
    }
  }

  activatePreviousItem() {
    const activeItemIndex = this.items.indexOf(this.getActiveItem());
    if (activeItemIndex > 0 && activeItemIndex <= this.items.length - 1) {
      const newActiveItem = this.items[activeItemIndex - 1];
      this.activateItem(newActiveItem);
      return newActiveItem;
    } else {
      this.clearActivity();
    }
  }

  clearSelection() {
    this.items.forEach(function (item) {
      item.checked = false;
    });
  }

  clearActivity() {
    const activeItem = this.getActiveItem();
    if (activeItem) {
      activeItem.active = false;
    }
    this.emitEvent('rgTable:activateItem', null);
  }

  checkItem(item) {
    if (item) {
      item.checked = true;
      this.triggerSelectionChanged(item);
    }
  }

  uncheckItem(item) {
    if (item) {
      item.checked = false;
      this.triggerSelectionChanged(item);
    }
  }

  toggleCheck(item) {
    item.checked = !item.checked;
    this.triggerSelectionChanged(item);
  }

  triggerSelectionChanged(item) {
    this.emitEvent('rgTable:selectionChanged', item);
  }

  getCheckedItems() {
    return this.items.filter(function (item) {
      return item.checked;
    });
  }
}
