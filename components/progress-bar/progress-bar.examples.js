import React, {Component} from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Theme from '@jetbrains/ring-ui/components/global/theme';

import ProgressBar from '@jetbrains/ring-ui/components/progress-bar/progress-bar';

const disableAnimations = window.location.search.includes('block-animations');

export default {
  title: 'Components/Progress Bar',
  decorators: [reactDecorator()]
};

export const basic = () => {
  class ProgressBarDemo extends Component {
    state = {
      value: disableAnimations ? 0.5 : 0
    };

    componentDidMount() {
      if (disableAnimations) {
        return;
      }
      setInterval(
        () => this.setState(({value}) => ({value: value >= 1 ? 0 : value + 0.1})),
        500
      );
    }

    render() {
      const {value} = this.state;

      return (
        <div>
          <div style={{height: '25px', paddingTop: '25px'}}>
            <ProgressBar value={value} style={{width: 288}}/>
          </div>

          <div style={{height: '25px', paddingTop: '25px', background: '#000'}}>
            <ProgressBar value={value} theme={Theme.DARK} style={{width: 288}}/>
          </div>

          <div style={{height: '25px', paddingTop: '25px', background: '#F0F0F0'}}>
            <ProgressBar value={value} style={{width: 288}}/>
          </div>
        </div>
      );
    }
  }

  return <ProgressBarDemo/>;
};

basic.story = {
  name: 'basic'
};
