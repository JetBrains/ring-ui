import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';

import LoaderInline from './loader-inline';
import injectStyles from './inject-styles';

storiesOf('Components|Inline Loader', module).
  addDecorator(reactDecorator()).
  add('Inline loader', () => {
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
  add('Inline loader with children', () => {
    class Example extends React.Component {
      render() {
        return (
          <LoaderInline>Loading...</LoaderInline>
        );
      }
    }

    return <Example/>;
  }).
  add('Inline loader on black background', () => {
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
  add('Inline loader on custom background', () => {
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
  add('Inline loader without React', () => {
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
