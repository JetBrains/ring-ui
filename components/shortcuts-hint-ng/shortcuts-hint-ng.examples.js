import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import ShortcutsHintNg from './shortcuts-hint-ng';

export default {
  title: 'Legacy Angular|ShortcutsHint Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Displays a popup listing all registered shortcuts.',
    hermione: {captureSelector: '*[data-test~=ring-dialog]'}
  }
};

export const basic = () => {
  angular.
    module(APP_NAME, [ShortcutsHintNg]).
    config(shortcutsProvider => {
      shortcutsProvider.
        mode({
          id: 'some-kind-shortcuts',
          title: 'Some Action Related Shortcuts',
          shortcuts: [
            {
              key: 'meta+enter+home',
              action: 'someAction',
              title: 'Do some action shortcut'
            },
            {
              key: 'ctrl+shift+down',
              action: 'someAction',
              title:
                'Another action shortcut with very very very very very very very very very very long text description'
            },
            {
              key: ['ctrl+alt+e', 'shift+down+u'],
              action: 'someAction',
              title: 'Another action shortcut with multiple keys'
            },
            {
              key: ['meta+right+left+end'],
              action: 'fooBarAction',
              title:
                'Blah blah blah Blah blah blah Blah blah blah Blah blah blahBlah blah blahBlah blah blah'
            },
            {
              key: ['meta+esc+del+end'],
              action: 'someAction',
              title: 'Blah blah'
            },
            {
              key: ['ctrl+alt+e', 'shift+e+enter'],
              action: 'someAction',
              title: 'Fo bar cooo'
            },
            {
              key: ['shift+down+u'],
              action: 'someAction',
              title: 'Another action shortcut with multiple keys'
            },
            {
              key: ['ctrl+alt+e'],
              action: 'someAction',
              title:
                'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
            },
            {
              key: ['shift+down+u+]'],
              action: 'someAction',
              title: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
            },
            {
              key: ['ctrl+alt+right+up+down'],
              action: 'someAction',
              title: 'Lorem Ipsum is simply'
            }
          ]
        }).
        mode({
          id: 'some-other-shortcuts',
          title: 'Shortcuts for other actions',
          shortcuts: [
            {
              key: 'meta+=',
              action: 'someAction',
              title: 'Do some action shortcut'
            },
            {
              key: 'alt+N',
              action: 'someAction',
              title: 'Another action shortcut with very very long text description'
            },
            {
              key: 'shift+left+down',
              action: 'someAction',
              title: 'Another action shortcut'
            }
          ]
        });
    }).
    controller('testCtrl', function controller($timeout, rgShortcutsHintPopup) {
      this.showPopup = () => {
        rgShortcutsHintPopup.show({
          tailTemplate: `
              <div>
                You can write anything here, this is a custom section.
                You can even create your own footer.
              </div>
            `
        });
      };

      $timeout(this.showPopup, 200);
    });

  return `
      <div ng-controller="testCtrl as ctrl">
        <button ng-click="ctrl.showPopup()">Show popup</button>
        <rg-dialog></rg-dialog>
      </div>
    `;
};

basic.story = {
  name: 'basic'
};
