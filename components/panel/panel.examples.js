/* eslint-disable max-len */
import React, {Component} from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';

import Button from '../button/button';

import Panel from './panel';

storiesOf('Components|Panel', module).
  addDecorator(reactDecorator()).
  add('basic', () => {
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
  });
