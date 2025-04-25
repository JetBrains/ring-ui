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
      expect(container).to.exist;
    });

    it('should call shortcut handler', () => {
      const shortcuts = createShortcutsMap();
      renderInputWithShortcuts(shortcuts);
      simulateCombo('enter');

      expect(shortcuts.map.enter).to.be.called;
    });

    it('should disable shortcuts', () => {
      const shortcuts = createShortcutsMap();
      shortcuts.options.disabled = true;

      renderInputWithShortcuts(shortcuts);

      simulateCombo('enter');

      expect(shortcuts.map.enter).to.not.be.called;
    });
  });
});
