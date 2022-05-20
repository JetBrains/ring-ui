import shortcuts from '../src/shortcuts/core';

export default function simulateCombo(input: string) {
  const combos = input.split(/\s+/g);
  combos.forEach(combo => shortcuts.trigger(combo));
  if (combos.length > 1) {
    // trigger the full sequence
    shortcuts.trigger(input);
  }
}
