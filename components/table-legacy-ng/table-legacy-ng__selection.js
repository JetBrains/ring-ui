import 'core-js/modules/es6.array.find';

/**
 * Selection class, catches all selection and activation operations and triggers events
 */
export default class Selection {
  suggestedItem = null;

  constructor(items, emitEvent, singleActiveElementAsSelection = true) {
    this.items = items;
    this.emitEvent = emitEvent;
    this.singleActiveElementAsSelection = singleActiveElementAsSelection;
  }

  setItems(items) {
    this.items = items;
    this.suggestedItem = null;
    this.emitEvent('rgLegacyTable:itemsChanged', items);
  }

  activateItem(item) {
    if (item && !item.unselectable) {
      this.clearActivity();
      item.active = true;
      this.emitEvent('rgLegacyTable:activateItem', item, this.items.indexOf(item));
    }
  }

  getActiveItem() {
    if (!this.items) {
      return undefined;
    }

    return this.items.find(item => item.active);
  }

  getActiveItemIndex() {
    return this.items.indexOf(this.getActiveItem());
  }

  setActiveItemIndex(index) {
    const item = this.items[index];
    this.activateItem(item);
  }

  findNextActiveItem(startIndex, direction) {
    const maxIndex = this.items.length - 1;

    if (direction) {
      for (let i = startIndex + 1; i <= maxIndex; i++) {
        if (!this.items[i].unselectable) {
          return this.items[i];
        }
      }
    } else {
      for (let i = startIndex - 1; i >= 0; i--) {
        if (!this.items[i].unselectable) {
          return this.items[i];
        }
      }
    }

    return undefined;
  }

  activateNextItem() {
    const activeItemIndex = this.items.indexOf(this.getActiveItem());
    if (activeItemIndex === -1 && this.suggestedItem) {
      this.activateItem(this.suggestedItem);
      return this.suggestedItem;
    } else if (activeItemIndex >= 0 && activeItemIndex < this.items.length - 1) {
      const newActiveItem = this.findNextActiveItem(activeItemIndex, 1);
      this.activateItem(newActiveItem);
      return newActiveItem;
    } else {
      this.clearActivity();
      return undefined;
    }
  }

  activatePreviousItem() {
    const activeItemIndex = this.items.indexOf(this.getActiveItem());
    if (activeItemIndex === -1 && this.suggestedItem) {
      this.activateItem(this.suggestedItem);
      return this.suggestedItem;
    } else if (activeItemIndex > 0 && activeItemIndex <= this.items.length - 1) {
      const newActiveItem = this.findNextActiveItem(activeItemIndex, 0);
      this.activateItem(newActiveItem);
      return newActiveItem;
    } else {
      this.clearActivity();
      return undefined;
    }
  }

  clearSelection() {
    this.clearCheckedItems();
    if (this.singleActiveElementAsSelection) {
      this.clearActivity();
    }
  }

  clearCheckedItems() {
    this.items.forEach(item => {
      item.checked = false;
    });
  }

  clearActivity() {
    const activeItem = this.getActiveItem();
    if (activeItem) {
      activeItem.active = false;
    }
    this.emitEvent('rgLegacyTable:activateItem', null);
  }

  checkItem(item) {
    if (item && !item.uncheckable && !item.unselectable) {
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
    if (item && !item.uncheckable && !item.unselectable) {
      item.checked = !item.checked;
      this.triggerSelectionChanged(item);
    }
  }

  triggerSelectionChanged(item) {
    this.emitEvent('rgLegacyTable:selectionChanged', item);
  }

  getCheckedItems() {
    if (!this.items) {
      return [];
    }

    return this.items.filter(item => item.checked);
  }

  getSelectedItems() {
    const checked = this.getCheckedItems();
    if (!checked.length) {
      const active = this.getActiveItem();
      if (active && this.singleActiveElementAsSelection) {
        return [active];
      } else {
        return [];
      }
    } else {
      return checked;
    }
  }

  setSuggestedItem(item) {
    this.suggestedItem = item;
  }
}
