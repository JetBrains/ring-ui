import React, {Component} from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Input from '@jetbrains/ring-ui/components/input/input';
import Button from '@jetbrains/ring-ui/components/button/button';
import Link from '@jetbrains/ring-ui/components/link/link';
import Group from '@jetbrains/ring-ui/components/group/group';

import TabTrap from '@jetbrains/ring-ui/components/tab-trap/tab-trap';

export default {
  title: 'Components/TabTrap',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Disallows tabbing out of a designated area.',
    hermione: {skip: true}
  }
};

export const basic = () => {
  class TabTrapDemo extends Component {
    render() {
      return (
        <div>
          <Button>Outside of trap</Button>

          <h4>Trap start</h4>
          <TabTrap>
            <Input placeholder="inside trap" autoFocus/>
            <Group>
              <Button>Test</Button>
              <Link href="#">Test link</Link>
            </Group>
          </TabTrap>

          <h4>Trap end</h4>

          <Button>Outside of trap</Button>
        </div>
      );
    }
  }

  return <TabTrapDemo/>;
};

basic.storyName = 'TabTrap';
