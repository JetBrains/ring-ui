export default function selectionAdapter(selection) {
  return {
    get size() {
      return selection.getActive().size;
    },
    get items() {
      return [...selection.getActive()];
    }
  };
}
