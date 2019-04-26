import React, {Component} from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';

import Input from '../input/input';
import Button from '../button/button';
import Link from '../link/link';
import Group from '../group/group';

import TabTrap from './tab-trap';

storiesOf('Components|TabTrap', module).
  addDecorator(reactDecorator()).
  add('basic', () => {
    class TabTrapDemo extends Component {
      render() {
        return (
          <div>
            <Button>Outside of trap</Button>

            <h4>Trap start</h4>
            <TabTrap>
              <Input placeholder="inside trap" autoFocus/>
              <Group>
                <Button>
                  Test
                </Button>
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
  });
