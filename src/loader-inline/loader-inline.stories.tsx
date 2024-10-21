import {Component} from 'react';

import LoaderInline from './loader-inline';

export default {
  title: 'Components/Inline Loader',

  parameters: {
    notes: 'Displays a small animated loader, shown inline with text. Use case: contextual loading animation.',
  },
};

export const basic = () => {
  class Example extends Component {
    render() {
      return (
        <div>
          <span>some text on top</span>
          <div>
            before <LoaderInline /> Some text after
          </div>
          <div>some text under loader</div>
        </div>
      );
    }
  }

  return <Example />;
};

basic.storyName = 'basic';

export const withChildren = () => {
  class Example extends Component {
    render() {
      return <LoaderInline>Loading...</LoaderInline>;
    }
  }

  return <Example />;
};

withChildren.storyName = 'with children';

export const onCustomBackground = () => {
  class Example extends Component {
    render() {
      return (
        <div style={{backgroundColor: 'var(--ring-hover-background-color)'}}>
          <span>some text on top</span>
          <div>
            before <LoaderInline /> Some text after
          </div>
          <div>some text under loader</div>
        </div>
      );
    }
  }

  return <Example />;
};

onCustomBackground.storyName = 'on custom background';

export const withoutReact = () => {
  class Example extends Component {
    render() {
      return (
        <div>
          <div className="ring-loader-inline" />
        </div>
      );
    }
  }

  return <Example />;
};

withoutReact.storyName = 'without React';
