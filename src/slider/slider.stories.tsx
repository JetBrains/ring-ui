import {Slider} from './slider';

export default {
  title: 'Components/Slider',

  parameters: {
    notes: 'Displays a Slider'
  }
};

export const Basic = () => (
  <div className={'container'}>
    <Slider defaultValue={25}/>
  </div>
);

Basic.storyName = 'basic';
Basic.parameters = {
  storyStyles: `
    <style>
      .container {
        width: 390px;
        padding: 8px 16px;
      }
    </style>
  `
};

export const WithTag = () => (
  <div className={'container'}>
    <Slider
      defaultValue={21}
      showTag
    />
  </div>
);

WithTag.storyName = 'with tag';
WithTag.parameters = Basic.parameters;

export const WithTicks = () => (
  <div className={'container'}>
    <Slider defaultValue={50} step={10} showTag showTicks/>
  </div>
);

WithTicks.storyName = 'with ticks';
WithTicks.parameters = Basic.parameters;

export const WithMarks = () => (
  <div className={'container'}>
    <Slider
      defaultValue={25}
      step={25}
      marks
      showTicks
      showTag
    />
  </div>
);

WithMarks.storyName = 'with marks';
WithMarks.parameters = Basic.parameters;

export const WithCustomMarksAndTag = () => (
  <div className={'container'}>
    <Slider
      defaultValue={64}
      showTicks
      step={16}
      max={512}
      showTag
      renderTag={value => `${value}MB`}
      marks={[
        {value: 0, label: '0MB'},
        {value: 128, label: '128MB'},
        {value: 256, label: '256MB'},
        {value: 512, label: '512MB'}
      ]}
    />
  </div>
);

WithCustomMarksAndTag.storyName = 'with custom marks and tag';
WithCustomMarksAndTag.parameters = Basic.parameters;

export const Range = () => (
  <div className={'container'}>
    <Slider defaultValue={[2, 4]} max={6} showTicks marks showTag/>
  </div>
);

Range.storyName = 'range';
Range.parameters = Basic.parameters;

export const Disabled = () => (
  <div className={'container'}>
    <Slider defaultValue={2} max={4} showTag showTicks marks disabled/>
  </div>
);

Disabled.storyName = 'disabled';
Disabled.parameters = Basic.parameters;
