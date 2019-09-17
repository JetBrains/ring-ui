import React, {Component} from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Button from '../button/button';

import Panel from './panel';

export default {
  title: 'Components|Panel',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a button panel.'
  }
};

export const basic = () => {
  class PanelDemo extends Component {
    render() {
      return (
        <Panel>
          <Button blue>{'Apply changes'}</Button>
          <Button>{'Cancel'}</Button>
        </Panel>
      );
    }
  }

  return <PanelDemo/>;
};

basic.story = {
  name: 'basic'
};
