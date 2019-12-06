import sniffer from '../global/sniffer';

const macSymbolsMap = {
  enter: '⏎',
  shift: '⇧',
  meta: '⌘',
  alt: '⌥',
  ctrl: '⌃',
  backspace: '⌫',
  esc: 'Esc',
  tab: 'Tab',
  del: 'Del',
  home: 'Home',
  end: 'End',
  space: 'Space',
  ins: 'Insert',

  left: '←',
  up: '↑',
  right: '→',
  down: '↓'
};

const winSymbolsMap = {
  enter: 'Enter',
  shift: 'Shift',
  meta: 'Ctrl',
  alt: 'Alt',
  ctrl: 'Ctrl',
  backspace: 'Backspace',
  esc: 'Esc',
  tab: 'Tab',
  del: 'Delete',
  home: 'Home',
  end: 'End',
  space: 'Space',
  ins: 'Insert',

  left: '←',
  up: '↑',
  right: '→',
  down: '↓'
};

export function getShortcutTitle(shortcut) {
  const MAC_OS = sniffer.os.name === 'macos';
  const KEY_SEPARATOR = MAC_OS ? '' : '+';
  const symbolsMap = MAC_OS ? macSymbolsMap : winSymbolsMap;

  return shortcut.
    split(/\+/g).
    map(symbol => symbolsMap[symbol] || symbol.toUpperCase()).
    join(KEY_SEPARATOR);
}
