/* @flow */
import TableSelection from '../table/selection';

export default class Selection extends TableSelection {
  _buildData(data: []): Set<*> {
    const items = new Set();
    data.forEach(group => {
      items.add(group);
      group.items.forEach(item => {
        items.add(item);
      });
    });
    return items;
  }
}
