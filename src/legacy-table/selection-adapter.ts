import type TableSelection from '../global/table-selection';
import type {SelectionItem} from '../global/table-selection';

export default function selectionAdapter(getSelection: () => TableSelection<SelectionItem>) {
  return {
    get size() {
      return getSelection().getActive().size;
    },
    get items() {
      return [...getSelection().getActive()];
    },
  };
}
