export default class Selection {
  selected = new Set()
  focused = undefined

  constructor({selected, focused} = {}) {
    if (selected) {
      this.selected = new Set(selected);
    }
    if (focused) {
      this.focused = focused;
    }
  }

  getActive() {
    if (this.selected.size) {
      return new Set(this.selected);
    } else if (this.focused) {
      return new Set([this.focused]);
    } else {
      return new Set();
    }
  }
}
