import React from 'react';
import {shallow, mount} from 'enzyme';

import shortcutsHOC from './shortcuts-hoc';

import simulateCombo from 'simulate-combo';

describe('ShortcutsHOC', () => {
  describe('default', () => {
    const InputWithShortcuts = shortcutsHOC('input');

    const createShortcutsMap = () => ({
      options: {},
      map: {enter: sandbox.spy()}
    });

    const factory = shortcuts => (
      <InputWithShortcuts
        rgShortcutsOptions={shortcuts.options}
        rgShortcutsMap={shortcuts.map}
      />
    );

    const shallowInputWithShortcuts = shortcuts => shallow(factory(shortcuts));
    const mountInputWithShortcuts = shortcuts => mount(factory(shortcuts));

    it('should initialize', () => {
      const shortcuts = createShortcutsMap();
      shallowInputWithShortcuts(shortcuts).should.exist;
    });


    it('should call shortcut handler', () => {
      const shortcuts = createShortcutsMap();
      mountInputWithShortcuts(shortcuts);
      simulateCombo('enter');

      shortcuts.map.enter.should.be.called;
    });


    it('should disable shortcuts', () => {
      const shortcuts = createShortcutsMap();
      shortcuts.options.disabled = true;

      mountInputWithShortcuts(shortcuts);

      simulateCombo('enter');

      shortcuts.map.enter.should.not.be.called;
    });
  });
});
