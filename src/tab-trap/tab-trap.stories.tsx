import Input from '../input/input';
import Button from '../button/button';
import Link from '../link/link';
import Group from '../group/group';
import TabTrap from './tab-trap';
import Popup from '../popup/popup';
import Dropdown from '../dropdown/dropdown';

import styles from './tab-trap.stories.css';

export default {
  title: 'Components/TabTrap',

  parameters: {
    notes: 'Disallows tabbing out of a designated area.',
  },
};

export const Basic = () => {
  return (
    <div>
      <Button>Outside of trap</Button>

      <h4>Trap start</h4>
      <TabTrap>
        <Input placeholder='inside trap' autoFocus />
        <Group>
          <Button>Test</Button>
          <Link href='#'>Test link</Link>
        </Group>
      </TabTrap>

      <h4>Trap end</h4>

      <Button>Outside of trap</Button>
    </div>
  );
};

Basic.parameters = {
  screenshots: {
    actions: [
      {type: 'click', selector: '[placeholder="inside trap"]'},
      ...Array.from({length: 5}, () => ({
        type: 'keys',
        value: 'Tab',
      })),
      {
        type: 'capture',
        name: 'light',
        selector: '[id=storybook-root]',
      },
    ],
  },
};

export const WithMultipleControls = () => {
  return (
    <div className={styles.withMultipleControls}>
      <Button>button 1</Button>
      <Dropdown anchor='Click me' className={styles.dropdownComponent}>
        <Popup className={styles.popupComponent} trapFocus autoFocusFirst>
          Hello from Ring UI! <Button primary>Hello</Button>
          <Button>Test</Button>
        </Popup>
      </Dropdown>
      <Button>button 2</Button>
      <Button>button 3</Button>
      <Button>button 4</Button>
    </div>
  );
};

WithMultipleControls.parameters = {
  screenshots: {
    actions: [
      {type: 'click', selector: '[data-test-ring-dropdown-anchor]'},
      ...Array.from({length: 3}, () => ({
        type: 'keys',
        value: 'Tab',
      })),
      {
        type: 'capture',
        name: 'light',
        selector: '[id=storybook-root]',
      },
    ],
  },
};
