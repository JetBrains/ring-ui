import type Selection from './selection';
import type {SelectionItem} from './selection';

export default function selectionAdapter(getSelection: () => Selection<SelectionItem>) {
  return {
    get size() {
      return getSelection().getActive().size;
    },
    get items() {
      return [...getSelection().getActive()];
    },
  };
}
