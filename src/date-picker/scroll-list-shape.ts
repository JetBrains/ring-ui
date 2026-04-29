/**
 * List shape:
 * - empty items
 * - non-empty items
 * - central item containing scrollDate
 * - non-empty items
 * - empty items
 */
export class ScrollListShape {
  private emptyItems: number;
  private nonEmptyItems: number;

  constructor(emptyItems: number, nonEmptyItems: number) {
    this.emptyItems = emptyItems;
    this.nonEmptyItems = nonEmptyItems;
  }

  getItemsAround() {
    return this.emptyItems + this.nonEmptyItems;
  }

  isNotEmpty(i: number) {
    return this.emptyItems <= i && i < this.getItemsAround() + 1 + this.nonEmptyItems;
  }

  getEmptyKey(i: number) {
    return `e_${i}`;
  }
}
