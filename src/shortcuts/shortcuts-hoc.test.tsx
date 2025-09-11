import {render} from '@testing-library/react';

import simulateCombo from '../../test-helpers/simulate-combo';
import {type ShortcutsMap} from './core';
import shortcutsHOC, {type ShortcutsHOCOptions} from './shortcuts-hoc';

interface FactoryProps {
  options: ShortcutsHOCOptions;
  map: ShortcutsMap;
}

describe('ShortcutsHOC', () => {
  describe('default', () => {
    const InputWithShortcuts = shortcutsHOC('input');

    const createShortcutsMap = (): FactoryProps => ({
      options: {},
      map: {enter: vi.fn()},
    });

    const renderInputWithShortcuts = (shortcuts: FactoryProps) =>
      render(<InputWithShortcuts rgShortcutsOptions={shortcuts.options} rgShortcutsMap={shortcuts.map} />);

    it('should initialize', () => {
      const shortcuts = createShortcutsMap();
      const {container} = renderInputWithShortcuts(shortcuts);
      expect(container).to.exist;
    });

    it('should call shortcut handler', () => {
      const shortcuts = createShortcutsMap();
      renderInputWithShortcuts(shortcuts);
      simulateCombo('enter');

      expect(shortcuts.map.enter).toHaveBeenCalled();
    });

    it('should disable shortcuts', () => {
      const shortcuts = createShortcutsMap();
      shortcuts.options.disabled = true;

      renderInputWithShortcuts(shortcuts);

      simulateCombo('enter');

      expect(shortcuts.map.enter).not.toHaveBeenCalled();
    });
  });
});
