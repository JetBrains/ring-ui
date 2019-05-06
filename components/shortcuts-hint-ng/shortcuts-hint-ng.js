import angular from 'angular';

import searchIcon from '@jetbrains/icons/search.svg';

import RingAngularComponent from '../global/ring-angular-component';
import sniffer from '../global/sniffer';
import DialogNg from '../dialog-ng/dialog-ng';
import ShortcutsNg from '../shortcuts-ng/shortcuts-ng';
import RingTemplateNg from '../template-ng/template-ng';
import IconNg from '../icon-ng/icon-ng';
import InputNg from '../input-ng/input-ng';

import HintPopupTpl from './shortcuts-hint-ng.html';
import './shortcuts-hint-ng.scss';

/**
 * @name Shortcuts Ng Hint Popup
 */

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


const angularModule = angular.module(
  'Ring.shortcuts.hint-popup',
  [DialogNg, ShortcutsNg, IconNg, InputNg, RingTemplateNg]
);
const getTitle = title => (typeof title === 'function' ? title() : title);


class HintPopupService extends RingAngularComponent {
  static $inject = ['dialog', 'shortcuts'];

  show(popupConfig = {}, shortcutModes, okButtonLabel = 'Got it', searchPlaceholder = 'Search') {
    const {dialog, shortcuts} = this.$inject;

    const modes = shortcutModes || shortcuts.getRegisteredShortcuts();

    modes.forEach(mode => {
      mode.shortcuts.forEach(shortcut => {
        shortcut.titles = shortcut.titles || [];

        if (shortcut.title && !shortcut.titles.includes(shortcut.title)) {
          shortcut.titles.push(shortcut.title);
        }
      });
    });

    return dialog.show(Object.assign({
      template: HintPopupTpl,
      closeOnClick: true,
      autoWidth: true,
      cssClass: 'shortcuts-hint__dialog',
      controllerAs: 'hintPopupCtrl',
      buttons: [{
        label: okButtonLabel,
        default: true
      }],
      controller() {
        // eslint-disable-next-line consistent-this
        const ctrl = this;

        ctrl.searchIcon = searchIcon;
        ctrl.modes = modes;
        ctrl.tailTemplate = popupConfig.tailTemplate;
        ctrl.isArray = it => Array.isArray(it);
        ctrl.searchText = '';
        ctrl.searchPlaceholder = searchPlaceholder;
        ctrl.getTitle = getTitle;
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

    if (!shortcut.titles.length) {
      return false;
    } else {
      const keyMatches = key.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      const titleMatches = shortcut.titles.
        map(getTitle).
        join(' ').
        toLowerCase().
        indexOf(query.toLowerCase()) !== -1;
      const presentationMatches = keysPresentation.
        toLowerCase().
        indexOf(query.toLowerCase()) !== -1;

      return keyMatches || titleMatches || presentationMatches;
    }
  });
}

angularModule.service('rgShortcutsHintPopup', HintPopupService);
angularModule.filter('shortcutKeySymbol', () => shortcutKeySymbolFilter);
angularModule.filter('shortcutSearch', () => shortcutSearchFilter);

export default angularModule.name;
