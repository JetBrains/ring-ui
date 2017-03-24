import shortcuts from '../components/shortcuts/core';

export default function (input) {
  const combos = input.split(/\s+/g);
  combos.forEach(combo => shortcuts.trigger(combo));
  if (combos.length > 1) {
    // trigger the full sequence
    shortcuts.trigger(input);
  }
}
