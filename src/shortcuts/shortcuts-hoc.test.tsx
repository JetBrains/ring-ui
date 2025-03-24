import {render} from '@testing-library/react';

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

    const renderInputWithShortcuts = (shortcuts: FactoryProps) => {
      return render(<InputWithShortcuts rgShortcutsOptions={shortcuts.options} rgShortcutsMap={shortcuts.map} />);
    };

    it('should initialize', () => {
      const shortcuts = createShortcutsMap();
      const {container} = renderInputWithShortcuts(shortcuts);
      container.should.exist;
    });

    it('should call shortcut handler', () => {
      const shortcuts = createShortcutsMap();
      renderInputWithShortcuts(shortcuts);
      simulateCombo('enter');

      shortcuts.map.enter.should.be.called;
    });

    it('should disable shortcuts', () => {
      const shortcuts = createShortcutsMap();
      shortcuts.options.disabled = true;

      renderInputWithShortcuts(shortcuts);

      simulateCombo('enter');

      shortcuts.map.enter.should.not.be.called;
    });
  });
});
