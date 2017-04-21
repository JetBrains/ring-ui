/* eslint-disable func-names */

import React from 'react';
import {renderIntoDocument} from 'react-dom/test-utils';

import shortcutsHOC from './shortcuts-hoc';

import simulateCombo from 'simulate-combo';

describe('ShortcutsHOC', () => {
  describe('default', () => {
    const InputWithShortcuts = shortcutsHOC('input');

    function createShortcutsMap() {
      return {
        options: {},
        map: {enter: sinon.spy()}
      };
    }


    let shortcuts;
    beforeEach(function () {
      shortcuts = createShortcutsMap();


      this.component = renderIntoDocument(
        <InputWithShortcuts
          rgShortcutsOptions={shortcuts.options}
          rgShortcutsMap={shortcuts.map}
        />
      );
    });


    it('should initialize', function () {
      expect(this.component).to.be.defined;
    });


    it('should call shortcut handler', () => {
      simulateCombo('enter');

      expect(shortcuts.map.enter).to.be.called;
    });


    it('should disable shortcuts', function () {
      shortcuts = createShortcutsMap();
      shortcuts.options.disabled = true;

      this.component = renderIntoDocument(
        <InputWithShortcuts
          rgShortcutsOptions={shortcuts.options}
          rgShortcutsMap={shortcuts.map}
        />
      );

      simulateCombo('enter');

      expect(shortcuts.map.enter).not.to.be.called;
    });
  });
});
