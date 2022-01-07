import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Theme, {ThemeProvider} from '../global/theme';

import LoaderInline from './loader-inline';

export default {
  title: 'Components/Inline Loader',
  decorators: [reactDecorator()],

  parameters: {
    notes:
      'Displays a small animated loader, shown inline with text. Use case: contextual loading animation.'
  }
};

export const basic = () => {
  class Example extends React.Component {
    render() {
      return (
        <div>
          <span>some text on top</span>
          <div>
            before <LoaderInline/> Some text after
          </div>
          <div>some text under loader</div>
        </div>
      );
    }
  }

  return <Example/>;
};

basic.storyName = 'basic';

export const withChildren = () => {
  class Example extends React.Component {
    render() {
      return <LoaderInline>Loading...</LoaderInline>;
    }
  }

  return <Example/>;
};

withChildren.storyName = 'with children';

export const onBlackBackground = () => {
  class Example extends React.Component {
    render() {
      return (
        <ThemeProvider theme={Theme.DARK} style={{backgroundColor: 'var(--ring-content-background-color)', color: 'var(--ring-text-color)'}}>
          <span>some text on top</span>
          <div>
            before <LoaderInline/> Some text after
          </div>
          <div>some text under loader</div>
        </ThemeProvider>
      );
    }
  }

  return <Example/>;
};

onBlackBackground.storyName = 'on black background';

export const onCustomBackground = () => {
  class Example extends React.Component {
    render() {
      return (
        <div style={{backgroundColor: '#E5F4FF'}}>
          <span>some text on top</span>
          <div>
            before <LoaderInline/> Some text after
          </div>
          <div>some text under loader</div>
        </div>
      );
    }
  }

  return <Example/>;
};

onCustomBackground.storyName = 'on custom background';

export const withoutReact = () => {
  class Example extends React.Component {
    render() {
      return (
        <div>
          <div className="ring-loader-inline"/>
        </div>
      );
    }
  }

  return <Example/>;
};

withoutReact.storyName = 'without React';
