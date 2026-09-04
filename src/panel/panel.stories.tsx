import {Component} from 'react';

import Button from '../button/button';
import Panel from './panel';

export default {
  title: 'Components/Panel',

  parameters: {
    notes: 'Displays a button panel.',
  },
};

export const basic = () => {
  class PanelDemo extends Component {
    render() {
      return (
        <Panel>
          <Button>{'Cancel'}</Button>
          <Button primary>{'Apply changes'}</Button>
        </Panel>
      );
    }
  }

  return <PanelDemo />;
};

basic.storyName = 'Panel';
