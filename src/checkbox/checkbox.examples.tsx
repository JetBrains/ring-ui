import React, {Fragment} from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Checkbox, {CheckboxProps} from './checkbox';

export default {
  title: 'Components/Checkbox',
  decorators: [reactDecorator()],

  parameters: {
    component: Checkbox,
    framework: 'react',
    zeplinLink: 'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/6193bc70c6d749a970988caa'
  }
};

export const controls = (args: CheckboxProps) => <Checkbox {...args}/>;
controls.args = {label: 'label'};
controls.parameters = {hermione: {skip: true}};

export const basic = () => (
  <Fragment>
    <h1>Base Examples</h1>
    <div id="checkbox-base">
      <Checkbox label="One"/>
      <br/>
      <Checkbox label="Two" defaultChecked/>
      <br/>
      <Checkbox label="Indeterminate" indeterminate/>
      <br/>
      <Checkbox label="Indeterminate checked" indeterminate defaultChecked/>
    </div>

    <h1>Disabled checkboxes</h1>
    <div id="checkbox-disabled">
      <Checkbox label="One" disabled/>
      <br/>
      <Checkbox label="Two" disabled defaultChecked/>
      <br/>
      <Checkbox label="Indeterminate" disabled indeterminate/>
      <br/>
      <Checkbox label="Indeterminate checked" disabled indeterminate defaultChecked/>
    </div>

    <h1>Examples with outer styles</h1>
    <div id="checkbox-additional">
      <div style={{lineHeight: '60px'}}>
        <Checkbox defaultChecked>This checkbox is inside a div with large line-height.</Checkbox>
        <span>This text should be aligned on same line with checkbox label</span>
      </div>
      <div style={{lineHeight: '6px'}}>
        <Checkbox defaultChecked>This checkbox is inside a div with small line-height.</Checkbox>
        <span>This text should be aligned on same line with checkbox label</span>
      </div>
      <div style={{lineHeight: '48px', fontSize: '40px'}}>
        <Checkbox defaultChecked>This checkbox is inside a div with large font-size.</Checkbox>
        <span>This text should be aligned on same line with checkbox label</span>
      </div>
      <div style={{lineHeight: '6px', fontSize: '4px'}}>
        <Checkbox defaultChecked>This checkbox is inside a div with small font-size.</Checkbox>
        <span>This text should be aligned on same line with checkbox label</span>
      </div>
    </div>
  </Fragment>
);

basic.storyName = 'basic';
