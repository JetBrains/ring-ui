import {Slider} from '../slider';

import styles from './slider.stories.module.css';

export default {
  title: 'Components/Slider',

  parameters: {
    notes: 'Displays a Slider',
  },
};

export const Basic = () => (
  <div className={styles.container}>
    <Slider defaultValue={25} />
  </div>
);

Basic.storyName = 'basic';

export const WithTag = () => (
  <div className={styles.container}>
    <Slider defaultValue={21} showTag />
  </div>
);

WithTag.storyName = 'with tag';

export const WithTicks = () => (
  <div className={styles.container}>
    <Slider defaultValue={50} step={10} showTag showTicks />
  </div>
);

WithTicks.storyName = 'with ticks';

export const WithMarks = () => (
  <div className={styles.container}>
    <Slider defaultValue={25} step={25} marks showTicks showTag />
  </div>
);

WithMarks.storyName = 'with marks';

export const WithCustomMarksAndTag = () => (
  <div className={styles.container}>
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
        {value: 512, label: '512MB'},
      ]}
    />
  </div>
);

WithCustomMarksAndTag.storyName = 'with custom marks and tag';

export const Range = () => (
  <div className={styles.container}>
    <Slider defaultValue={[2, 4]} max={6} showTicks marks showTag />
  </div>
);

Range.storyName = 'range';

export const Disabled = () => (
  <div className={styles.container}>
    <Slider defaultValue={2} max={4} showTag showTicks marks disabled />
  </div>
);

Disabled.storyName = 'disabled';
