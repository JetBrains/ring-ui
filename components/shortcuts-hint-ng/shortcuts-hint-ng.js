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
 * @description A popup with a listing of registered shortcuts
 * @example
 *
<example name="Shortcuts Ng Hint Popup">
  <file name="index.html">
    <div ng-app="test" ng-controller="testCtrl as ctrl">
      <button ng-click="ctrl.showPopup()">Show popup</button>
      <rg-dialog></rg-dialog>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('angular');
    var ShortcutsHintNg = require('ring-ui/components/shortcuts-hint-ng/shortcuts-hint-ng');

    angular.module('test', [ShortcutsHintNg])
    .config(function(shortcutsProvider) {
      shortcutsProvider
        .mode({id: 'some-kind-shortcuts',
          title: 'Some Action Related Shortcuts',
          shortcuts: [
            {
              key: 'meta+enter+home',
              action: 'someAction',
              title: 'Do some action shortcut'
            }, {
              key: 'ctrl+shift+down',
              action: 'someAction',
              title: 'Another action shortcut with very very very very very very very very very very long text description'
            }, {
              key: ['ctrl+alt+e', 'shift+down+u'],
              action: 'someAction',
              title: 'Another action shortcut with multiple keys'
            }, {
              key: ['meta+right+left+end'],
              action: 'fooBarAction',
              title: 'Blah blah blah Blah blah blah Blah blah blah Blah blah blahBlah blah blahBlah blah blah'
            }, {
              key: ['meta+esc+del+end'],
              action: 'someAction',
              title: 'Blah blah'
            }, {
              key: ['ctrl+alt+e', 'shift+e+enter'],
              action: 'someAction',
              title: 'Fo bar cooo'
            }, {
              key: ['shift+down+u'],
              action: 'someAction',
              title: 'Another action shortcut with multiple keys'
            }, {
              key: ['ctrl+alt+e'],
              action: 'someAction',
              title: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
            }, {
              key: ['shift+down+u+]'],
              action: 'someAction',
              title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
            }, {
              key: ['ctrl+alt+right+up+down'],
              action: 'someAction',
              title: 'Lorem Ipsum is simply'
            }
          ]
        })
        .mode({
          id: 'some-other-shortcuts',
          title: 'Shortcuts for other actions',
          shortcuts: [
            {
              key: 'meta+=',
              action: 'someAction',
              title: 'Do some action shortcut'
            }, {
              key: 'alt+N',
              action: 'someAction',
              title: 'Another action shortcut with very very long text description'
            }, {
              key: 'shift+left+down',
              action: 'someAction',
              title: 'Another action shortcut'
            }
          ]
        })
    })
    .controller('testCtrl', function($timeout, rgShortcutsHintPopup) {
      var ctrl = this;

      ctrl.showPopup = function() {
        rgShortcutsHintPopup.show({
            tailTemplate: `
              <div>
                You can write anything here, this is a custom section.
                You can even create your own footer.
              </div>
            `
          });
      }

      $timeout(ctrl.showPopup, 200);
    });
  </file>
</example>
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
  const KEY_SEPARATOR = MAC_OS ? ' ' : ' + ';
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

    const keyMatches = key.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    const titleMatches = shortcut.title.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    const presentationMatches = keysPresentation.toLowerCase().indexOf(query.toLowerCase()) !== -1;

    return keyMatches || titleMatches || presentationMatches;
  });
}

angularModule.service('rgShortcutsHintPopup', HintPopupService);
angularModule.filter('shortcutKeySymbol', () => shortcutKeySymbolFilter);
angularModule.filter('shortcutSearch', () => shortcutSearchFilter);

export default angularModule.name;
