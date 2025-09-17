import {useEffect, useState} from 'react';
import {type Meta, type StoryObj} from '@storybook/react-webpack5';

import ProgressBar from './progress-bar';
import {type ProgressBarProps} from './progress-bar.interface';

const disableAnimations = window.location.search.includes('block-animations');

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/Progress Bar',
  component: ProgressBar,
  decorators: [
    (Story, context) => {
      const isInDocs = context.viewMode === 'docs';

      if (isInDocs) {
        return <Story />;
      }

      return (
        <div style={{paddingTop: '20px', paddingLeft: '20px', height: '25px', width: 300}}>
          <Story />
        </div>
      );
    },
  ],
  argTypes: {
    value: {
      control: {type: 'range', min: 0, max: 1, step: 0.1},
      description: 'Current progress value',
    },
    max: {
      control: {type: 'number', min: 0.1, step: 0.1},
      description: 'Maximum progress value',
    },
    label: {
      control: 'text',
      description: 'Accessibility label',
    },
    global: {
      control: 'boolean',
      description: 'Global positioning mode',
    },
    disableAnimation: {
      control: 'boolean',
      description: 'Disable color animation',
    },
    staticColor: {
      control: 'boolean',
      table: {disable: true},
    },
  },
  args: {
    value: 0.5,
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Basic: Story = {};

const AutoProgressDemo = (args: ProgressBarProps) => {
  const [value, setValue] = useState(disableAnimations ? 0.5 : 0);

  useEffect(() => {
    if (disableAnimations) return;

    const interval = setInterval(() => {
      setValue(prev => (prev >= 1 ? 0 : prev + 0.1));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <ProgressBar {...args} value={value} />;
};

export const AutoProgress: Story = {
  render: args => <AutoProgressDemo {...args} />,
  parameters: {
    screenshots: {skip: true},
  },
};

export const ZeroProgress: Story = {
  render: args => <ProgressBar {...args} value={0} />,
};

export const DisableAnimation: Story = {
  render: args => <ProgressBar {...args} disableAnimation />,
};

export const Global: Story = {
  render: args => (
    <div>
      <p>This progress bar is positioned globally at the top of the viewport:</p>
      <ProgressBar {...args} global label='Global progress' />
    </div>
  ),
  parameters: {
    screenshots: {skip: true},
  },
};
