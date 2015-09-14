import 'dialog-ng/dialog-ng';
import './shortcuts-ng__hint.scss';
import HintPopupTpl from './shortcuts-ng__hint.html';

let HintPopupModule = angular.module('Ring.shortcuts.hint-popup', ['Ring.dialog', 'Ring.shortcuts']);
HintPopupModule.run(($templateCache) => {
  $templateCache.put('shortcuts-ng__hint-popup.html', HintPopupTpl);
});


/**
 * @name Shortcuts Ng Hint Popup
 * @description Hint popup with help about registered shortcuts
 * @example
 *
<example name="Shortcuts-hint-popup">
  <file name="index.html">
    <div ng-app="test" ng-controller="testCtrl as ctrl">
      <button ng-click="ctrl.showPopup()">Show popup</button>
      <rg-dialog></rg-dialog>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('angular');
    require('shortcuts-ng/shortcuts-ng');

    angular.module('test', ['Ring.shortcuts.hint-popup', 'Ring.dialog'])
    .config(function(shortcutsProvider) {
      shortcutsProvider
        .mode({id: 'some-kind-shortcuts',
          title: 'Shortcuts Title',
          shortcuts: [
            {
              key: 'meta+enter',
              action: 'someAction',
              title: 'Do some action shortcut'
            },
            {
              key: 'ctrl+shift+down',
              action: 'someAction',
              title: 'Another action shortcut'
            }
          ]
        });
    })
    .controller('testCtrl', function($timeout, hintPopup) {
      var ctrl = this;

      ctrl.showPopup = function() {
        hintPopup.show('ShortCuts');
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

  show(title) {
    let modes = this.shortcuts.getRegisteredShortcuts();

    this.dialog.show({
      data: {modes},
      title,
      content: 'shortcuts-ng__hint-popup.html',
      buttons: [{
        label: 'OK',
        default: true,
        action: () => this.dialog.done()
      }]
    });
  }
}

function shortcutKeySymbolFilter(shortcut) {
  shortcut = shortcut.replace(/\+/ig, ' ');

  let symbolsMap = {
    enter: '⏎',
    shift: '⇧',
    meta: '⌘',
    alt: '⌥',
    ctrl: '⌃',

    left: '←',
    up: '↑',
    right: '→',
    down: '↓'
  };

  for (var symbol in symbolsMap) {
    shortcut = shortcut.replace(symbol, symbolsMap[symbol]);
  }
  return shortcut;
}

HintPopupModule.service('hintPopup', HintPopupService);
HintPopupModule.filter('shortcutKeySymbol', () => shortcutKeySymbolFilter);

export default HintPopupModule.name;
