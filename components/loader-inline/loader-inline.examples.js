import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';

import LoaderInline from './loader-inline';
import injectStyles from './inject-styles';

storiesOf('Components|Inline Loader', module).
  addParameters({
    notes: 'Displays a small animated loader, shown inline with text. Use case: contextual loading animation.'
  }).
  addDecorator(reactDecorator()).
  add('basic', () => {
    class Example extends React.Component {
      render() {
        return (
          <div>
            <span>some text on top</span>
            <div>before <LoaderInline/> Some text after</div>
            <div>some text under loader</div>
          </div>
        );
      }
    }

    return <Example/>;
  }).
  add('with children', () => {
    class Example extends React.Component {
      render() {
        return (
          <LoaderInline>Loading...</LoaderInline>
        );
      }
    }

    return <Example/>;
  }).
  add('on black background', () => {
    class Example extends React.Component {
      render() {
        return (
          <div style={{backgroundColor: 'black', color: '#ccc'}}>
            <span>some text on top</span>
            <div>before <LoaderInline/> Some text after</div>
            <div>some text under loader</div>
          </div>
        );
      }
    }

    return <Example/>;
  }).
  add('on custom background', () => {
    class Example extends React.Component {
      render() {
        return (
          <div style={{backgroundColor: '#E5F4FF'}}>
            <span>some text on top</span>
            <div>before <LoaderInline/> Some text after</div>
            <div>some text under loader</div>
          </div>
        );
      }
    }

    return <Example/>;
  }).
  add('without React', () => {
    class Example extends React.Component {
      render() {
        return (
          <div>
            <div className="ring-loader-inline"/>
          </div>
        );
      }
    }

    injectStyles();

    return <Example/>;
  });
