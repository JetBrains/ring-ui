import {shallow, mount} from 'enzyme';

import simulateCombo from '../../test-helpers/simulate-combo';

import {ShortcutsMap} from './core';

import shortcutsHOC, {ShortcutsHOCOptions} from './shortcuts-hoc';

interface FactoryProps {
  options: ShortcutsHOCOptions;
  map: ShortcutsMap;
}

describe('ShortcutsHOC', () => {
  describe('default', () => {
    const InputWithShortcuts = shortcutsHOC('input');

    const createShortcutsMap = (): FactoryProps => ({
      options: {},
      map: {enter: sandbox.spy()},
    });

    const factory = (shortcuts: FactoryProps) => (
      <InputWithShortcuts rgShortcutsOptions={shortcuts.options} rgShortcutsMap={shortcuts.map} />
    );

    const shallowInputWithShortcuts = (shortcuts: FactoryProps) => shallow(factory(shortcuts));
    const mountInputWithShortcuts = (shortcuts: FactoryProps) => mount(factory(shortcuts));

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
