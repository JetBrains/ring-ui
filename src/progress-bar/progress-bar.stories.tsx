import {Component} from 'react';

import ProgressBar from './progress-bar';

const disableAnimations = window.location.search.includes('block-animations');

export default {
  title: 'Components/Progress Bar',
};

export const basic = () => {
  interface ProgressBarDemoState {
    value: number;
  }
  class ProgressBarDemo extends Component<{}, ProgressBarDemoState> {
    state = {
      value: disableAnimations ? 0.5 : 0,
    };

    componentDidMount() {
      if (disableAnimations) {
        return;
      }
      setInterval(() => this.setState(({value}) => ({value: value >= 1 ? 0 : value + 0.1})), 500);
    }

    render() {
      const {value} = this.state;

      return (
        <div>
          <div style={{height: '25px', paddingTop: '25px'}}>
            <ProgressBar label='Progress' value={value} style={{width: 288}} />
          </div>

          <div style={{height: '25px', paddingTop: '25px', background: '#F0F0F0'}}>
            <ProgressBar label='Progress' value={value} style={{width: 288}} />
          </div>

          <div style={{height: '25px', paddingTop: '25px'}}>
            <ProgressBar label='Progress' value={0.5} staticColor style={{width: 288}} />
          </div>
        </div>
      );
    }
  }

  return <ProgressBarDemo />;
};

basic.storyName = 'Progress Bar';
