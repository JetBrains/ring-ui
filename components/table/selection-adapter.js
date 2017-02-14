export default function selectionAdapter(getSelection) {
  return {
    get size() {
      return getSelection().getActive().size;
    },
    get items() {
      return [...getSelection().getActive()];
    }
  };
}
