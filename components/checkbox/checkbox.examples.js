import React, {Fragment} from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import Checkbox from '../checkbox/checkbox';

storiesOf('Components|Checkbox', module).
  addParameters({
    notes: 'Displays a checkbox.'
  }).
  addDecorator(reactDecorator()).
  add('basic', () => (
    <Fragment>
      <h1>Base Examples</h1>
      <div id="checkbox-base">
        <Checkbox/>
        <Checkbox defaultChecked/>
      </div>

      <h1>Disabled checkboxes</h1>
      <div id="checkbox-base">
        <Checkbox disabled/>
        <Checkbox disabled defaultChecked/>
      </div>

      <h1>Examples with outer styles</h1>
      <div id="checkbox-additional">
        <div style={{lineHeight: '60px'}}>
          <Checkbox defaultChecked>
            This checkbox is inside a div with large line-height.
          </Checkbox>
          <span>This text should be aligned on same line with checkbox label</span>
        </div>
        <div style={{lineHeight: '6px'}}>
          <Checkbox defaultChecked>
            This checkbox is inside a div with small line-height.
          </Checkbox>
          <span>This text should be aligned on same line with checkbox label</span>
        </div>
        <div style={{lineHeight: '48px', fontSize: '40px'}}>
          <Checkbox defaultChecked>
            This checkbox is inside a div with large font-size.
          </Checkbox>
          <span>This text should be aligned on same line with checkbox label</span>
        </div>
        <div style={{lineHeight: '6px', fontSize: '4px'}}>
          <Checkbox defaultChecked>
            This checkbox is inside a div with small font-size.
          </Checkbox>
          <span>This text should be aligned on same line with checkbox label</span>
        </div>
      </div>
    </Fragment>
  ));
