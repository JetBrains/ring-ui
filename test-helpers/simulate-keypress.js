import {simulate} from 'combokeys/test/lib/key-event';

export default function (char, keyCode, modifiers) {
  const charCode = char && char.charCodeAt(0) || 0;

  return simulate(charCode, keyCode || 0, modifiers);
}
