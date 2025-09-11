import {render} from '@testing-library/react';

import simulateCombo from '../../test-helpers/simulate-combo';
import getUID from '../global/get-uid';
import Shortcuts, {type ShortcutsProps} from './shortcuts';

type ShortcutsAttrs = React.JSX.LibraryManagedAttributes<typeof Shortcuts, ShortcutsProps>;
type FactoryProps = Omit<ShortcutsAttrs, 'map' | 'scope'>;

describe('ShortcutsComponent', () => {
  const renderShortcuts = (props?: FactoryProps) => {
    const map = {enter: vi.fn()};
    const scope = getUID('shortcuts-test-');
    const result = render(<Shortcuts map={map} scope={scope} {...props} />);
    return {
      ...result,
      map,
      scope,
    };
  };

  it('should initialize', () => {
    const {container} = renderShortcuts();
    expect(container).to.exist;
  });

  it('should call shortcut handler', () => {
    const {map} = renderShortcuts();
    simulateCombo('enter');

    expect(map.enter).toHaveBeenCalled();
  });

  it('should enable shortcuts if disabled becomes "false"', () => {
    const {map, rerender, scope} = renderShortcuts({disabled: true});

    simulateCombo('enter');
    expect(map.enter).not.toHaveBeenCalled();

    rerender(<Shortcuts map={map} scope={scope} disabled={false} />);

    simulateCombo('enter');
    expect(map.enter).toHaveBeenCalled();
  });
});
