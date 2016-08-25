import sniffer from '../sniffer/sniffer';

import DialogNg from '../dialog-ng/dialog-ng';
import ShortcutsNg from '../shortcuts-ng/shortcuts-ng';
import RingTemplateNg from '../template-ng/template-ng';
import HintPopupTpl from './shortcuts-hint-ng.html';
import Icon from '../icon/icon';
import {registerComponents, reactNg} from '../react-ng/react-ng';

import './shortcuts-hint-ng.scss';
import '../input/input.scss';
import searchIcon from 'jetbrains-icons/search.svg';

registerComponents({Icon});

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
  del: 'Del',
  home: 'Home',
  end: 'End',
  space: 'Space',

  left: '←',
  up: '↑',
  right: '→',
  down: '↓'
};

/* global angular:false */
const angularModule = angular.module('Ring.shortcuts.hint-popup', [DialogNg, ShortcutsNg, reactNg, RingTemplateNg]);


/**
 * @name Shortcuts Ng Hint Popup
 * @category Angular Components
 * @description A popup with a listing of registered shortcuts
 * @example-file ./shortcuts-hint-ng__examples.html
*/

class HintPopupService {
  constructor(dialog, shortcuts) {
    this.dialog = dialog;
    this.shortcuts = shortcuts;
  }

  show(popupConfig = {}, shortcutModes) {
    const modes = shortcutModes || this.shortcuts.getRegisteredShortcuts();

    return this.dialog.show(Object.assign({
      template: HintPopupTpl,
      closeOnClick: true,
      autoWidth: true,
      controllerAs: 'hintPopupCtrl',
      buttons: [{
        label: 'Got it',
        default: true
      }],
      controller() {
        /*eslint-disable consistent-this*/
        const ctrl = this;
        /*eslint-enable consistent-this*/

        ctrl.searchIcon = searchIcon;
        ctrl.modes = modes;
        ctrl.tailTemplate = popupConfig.tailTemplate;
        ctrl.isArray = it => Array.isArray(it);
        ctrl.searchText = '';
      }
    }, popupConfig));
  }
}

function shortcutKeySymbolFilter(shortcut) {
  const MAC_OS = sniffer.os.name === 'macos';
  const KEY_SEPARATOR = MAC_OS ? '' : '+';
  const symbolsMap = MAC_OS ? macSymbolsMap : winSymbolsMap;

  return shortcut.
    split(/\+/g).
    map(symbol => symbolsMap[symbol] || symbol.toUpperCase()).
    join(KEY_SEPARATOR);
}

function shortcutSearchFilter(shortcuts, query = '') {
  return (shortcuts || []).filter(shortcut => {
    const key = shortcut.key.join ? shortcut.key.join(' ') : shortcut.key;
    const keysPresentation = shortcutKeySymbolFilter(key);

    if (!shortcut.title) {
      return false;
    } else {
      const keyMatches = key.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      const titleMatches = shortcut.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      const presentationMatches = keysPresentation.toLowerCase().indexOf(query.toLowerCase()) !== -1;

      return keyMatches || titleMatches || presentationMatches;
    }
  });
}

angularModule.service('rgShortcutsHintPopup', HintPopupService);
angularModule.filter('shortcutKeySymbol', () => shortcutKeySymbolFilter);
angularModule.filter('shortcutSearch', () => shortcutSearchFilter);

export default angularModule.name;
