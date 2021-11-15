import React, {Component} from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Button from '@jetbrains/ring-ui/components/button/button';

import Panel from '@jetbrains/ring-ui/components/panel/panel';

export default {
  title: 'Components/Panel',
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
          <Button primary>{'Apply changes'}</Button>
          <Button>{'Cancel'}</Button>
        </Panel>
      );
    }
  }

  return <PanelDemo/>;
};

basic.storyName = 'Panel';
