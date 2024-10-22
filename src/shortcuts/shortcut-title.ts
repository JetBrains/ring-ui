import sniffer from '../global/sniffer';

const macSymbolsMap: Record<string, string> = {
  enter: '⏎',
  shift: '⇧',
  meta: '⌘',
  mod: '⌘',
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
  down: '↓',
};

const winSymbolsMap: Record<string, string> = {
  enter: 'Enter',
  shift: 'Shift',
  meta: 'Ctrl',
  mod: 'Ctrl',
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
  down: '↓',
};

export function getShortcutTitle(shortcut: string) {
  const MAC_OS = sniffer.os.name === 'macos';
  const KEY_SEPARATOR = MAC_OS ? '' : '+';
  const symbolsMap = MAC_OS ? macSymbolsMap : winSymbolsMap;

  return shortcut
    .split(/\+/g)
    .map(symbol => symbolsMap[symbol] || symbol.toUpperCase())
    .join(KEY_SEPARATOR);
}
