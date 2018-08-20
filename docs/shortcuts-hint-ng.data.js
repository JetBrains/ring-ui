window.source = {
  "title": "Shortcuts Ng Hint Popup",
  "url": "shortcuts-hint-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\nimport 'core-js/modules/es7.array.includes';\n\nimport {SearchIcon} from '../icon';\n\nimport RingAngularComponent from '../global/ring-angular-component';\nimport sniffer from '../global/sniffer';\nimport DialogNg from '../dialog-ng/dialog-ng';\nimport ShortcutsNg from '../shortcuts-ng/shortcuts-ng';\nimport RingTemplateNg from '../template-ng/template-ng';\nimport IconNg from '../icon-ng/icon-ng';\nimport InputNg from '../input-ng/input-ng';\n\nimport HintPopupTpl from './shortcuts-hint-ng.html';\nimport './shortcuts-hint-ng.scss';\n\n/**\n * @name Shortcuts Ng Hint Popup\n * @category Legacy Angular\n * @tags Ring UI Language\n * @description Displays a popup listing all registered shortcuts.\n * @example-file ./shortcuts-hint-ng.examples.html\n */\n\nconst macSymbolsMap = {\n  enter: '⏎',\n  shift: '⇧',\n  meta: '⌘',\n  alt: '⌥',\n  ctrl: '⌃',\n  backspace: '⌫',\n  esc: 'Esc',\n  tab: 'Tab',\n  del: 'Del',\n  home: 'Home',\n  end: 'End',\n  space: 'Space',\n  ins: 'Insert',\n\n  left: '←',\n  up: '↑',\n  right: '→',\n  down: '↓'\n};\n\nconst winSymbolsMap = {\n  enter: 'Enter',\n  shift: 'Shift',\n  meta: 'Ctrl',\n  alt: 'Alt',\n  ctrl: 'Ctrl',\n  backspace: 'Backspace',\n  esc: 'Esc',\n  tab: 'Tab',\n  del: 'Delete',\n  home: 'Home',\n  end: 'End',\n  space: 'Space',\n  ins: 'Insert',\n\n  left: '←',\n  up: '↑',\n  right: '→',\n  down: '↓'\n};\n\n\nconst angularModule = angular.module(\n  'Ring.shortcuts.hint-popup',\n  [DialogNg, ShortcutsNg, IconNg, InputNg, RingTemplateNg]\n);\nconst getTitle = title => (typeof title === 'function' ? title() : title);\n\n\nclass HintPopupService extends RingAngularComponent {\n  static $inject = ['dialog', 'shortcuts'];\n\n  show(popupConfig = {}, shortcutModes, okButtonLabel = 'Got it', searchPlaceholder = 'Search') {\n    const {dialog, shortcuts} = this.$inject;\n\n    const modes = shortcutModes || shortcuts.getRegisteredShortcuts();\n\n    modes.forEach(mode => {\n      mode.shortcuts.forEach(shortcut => {\n        shortcut.titles = shortcut.titles || [];\n\n        if (shortcut.title && !shortcut.titles.includes(shortcut.title)) {\n          shortcut.titles.push(shortcut.title);\n        }\n      });\n    });\n\n    return dialog.show(Object.assign({\n      template: HintPopupTpl,\n      closeOnClick: true,\n      autoWidth: true,\n      cssClass: 'shortcuts-hint__dialog',\n      controllerAs: 'hintPopupCtrl',\n      buttons: [{\n        label: okButtonLabel,\n        default: true\n      }],\n      controller() {\n        // eslint-disable-next-line consistent-this\n        const ctrl = this;\n\n        ctrl.searchIcon = SearchIcon;\n        ctrl.modes = modes;\n        ctrl.tailTemplate = popupConfig.tailTemplate;\n        ctrl.isArray = it => Array.isArray(it);\n        ctrl.searchText = '';\n        ctrl.searchPlaceholder = searchPlaceholder;\n        ctrl.getTitle = getTitle;\n      }\n    }, popupConfig));\n  }\n}\n\nfunction shortcutKeySymbolFilter(shortcut) {\n  const MAC_OS = sniffer.os.name === 'macos';\n  const KEY_SEPARATOR = MAC_OS ? '' : '+';\n  const symbolsMap = MAC_OS ? macSymbolsMap : winSymbolsMap;\n\n  return shortcut.\n    split(/\\+/g).\n    map(symbol => symbolsMap[symbol] || symbol.toUpperCase()).\n    join(KEY_SEPARATOR);\n}\n\nfunction shortcutSearchFilter(shortcuts, query = '') {\n  return (shortcuts || []).filter(shortcut => {\n    const key = shortcut.key.join ? shortcut.key.join(' ') : shortcut.key;\n    const keysPresentation = shortcutKeySymbolFilter(key);\n\n    if (!shortcut.titles.length) {\n      return false;\n    } else {\n      const keyMatches = key.toLowerCase().indexOf(query.toLowerCase()) !== -1;\n      const titleMatches = shortcut.titles.\n        map(getTitle).\n        join(' ').\n        toLowerCase().\n        indexOf(query.toLowerCase()) !== -1;\n      const presentationMatches = keysPresentation.\n        toLowerCase().\n        indexOf(query.toLowerCase()) !== -1;\n\n      return keyMatches || titleMatches || presentationMatches;\n    }\n  });\n}\n\nangularModule.service('rgShortcutsHintPopup', HintPopupService);\nangularModule.filter('shortcutKeySymbol', () => shortcutKeySymbolFilter);\nangularModule.filter('shortcutSearch', () => shortcutSearchFilter);\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Shortcuts Ng Hint Popup",
      "url": "examples/shortcuts-hint-ng/shortcuts-ng-hint-popup.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as ctrl\">\n  <button ng-click=\"ctrl.showPopup()\">Show popup</button>\n  <rg-dialog></rg-dialog>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport ShortcutsHintNg from '@jetbrains/ring-ui/components/shortcuts-hint-ng/shortcuts-hint-ng';\n\nangular.module('test', [ShortcutsHintNg])\n.config(function(shortcutsProvider) {\n  shortcutsProvider\n    .mode({id: 'some-kind-shortcuts',\n      title: 'Some Action Related Shortcuts',\n      shortcuts: [\n        {\n          key: 'meta+enter+home',\n          action: 'someAction',\n          title: 'Do some action shortcut'\n        }, {\n          key: 'ctrl+shift+down',\n          action: 'someAction',\n          title: 'Another action shortcut with very very very very very very very very very very long text description'\n        }, {\n          key: ['ctrl+alt+e', 'shift+down+u'],\n          action: 'someAction',\n          title: 'Another action shortcut with multiple keys'\n        }, {\n          key: ['meta+right+left+end'],\n          action: 'fooBarAction',\n          title: 'Blah blah blah Blah blah blah Blah blah blah Blah blah blahBlah blah blahBlah blah blah'\n        }, {\n          key: ['meta+esc+del+end'],\n          action: 'someAction',\n          title: 'Blah blah'\n        }, {\n          key: ['ctrl+alt+e', 'shift+e+enter'],\n          action: 'someAction',\n          title: 'Fo bar cooo'\n        }, {\n          key: ['shift+down+u'],\n          action: 'someAction',\n          title: 'Another action shortcut with multiple keys'\n        }, {\n          key: ['ctrl+alt+e'],\n          action: 'someAction',\n          title: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'\n        }, {\n          key: ['shift+down+u+]'],\n          action: 'someAction',\n          title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry'\n        }, {\n          key: ['ctrl+alt+right+up+down'],\n          action: 'someAction',\n          title: 'Lorem Ipsum is simply'\n        }\n      ]\n    })\n    .mode({\n      id: 'some-other-shortcuts',\n      title: 'Shortcuts for other actions',\n      shortcuts: [\n        {\n          key: 'meta+=',\n          action: 'someAction',\n          title: 'Do some action shortcut'\n        }, {\n          key: 'alt+N',\n          action: 'someAction',\n          title: 'Another action shortcut with very very long text description'\n        }, {\n          key: 'shift+left+down',\n          action: 'someAction',\n          title: 'Another action shortcut'\n        }\n      ]\n    })\n})\n.controller('testCtrl', function($timeout, rgShortcutsHintPopup) {\n  var ctrl = this;\n\n  ctrl.showPopup = function() {\n    rgShortcutsHintPopup.show({\n        tailTemplate: `\n          <div>\n            You can write anything here, this is a custom section.\n            You can even create your own footer.\n          </div>\n        `\n      });\n  }\n\n  $timeout(ctrl.showPopup, 200);\n});\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Displays a popup listing all registered shortcuts.",
  "attrs": {
    "name": "Shortcuts Ng Hint Popup",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "description": "Displays a popup listing all registered shortcuts.",
    "example-file": "./shortcuts-hint-ng.examples.html"
  }
};