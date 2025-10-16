// This is a template Storybook configuration.

import {type Meta, type StoryObj} from '@storybook/react-webpack5';

// Replace with your component import
import Button, {type ButtonProps} from '../../src/button/button';

// Example Storybook metadata
const meta: Meta<typeof Button> = {
  title: 'Entity/Template', // example: Components/Button
  component: Button,

  parameters: {
    // Docs parameters for the custom Import block
    docs: {
      importSubpath: 'components/template/template', // update to match your folder structure
      exportName: 'Template', // name of the exported component
    },
  },

  // Prop controls and descriptions for the Docs panel
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disables the button when true',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback fired when the button is clicked',
    },
  },

  // Default args for the basic story
  args: {
    children: 'Click me',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Add your stories here
export const Basic: Story = {
  render: (args: ButtonProps) => <Button {...args} />,
};
