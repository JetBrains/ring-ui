import {type Meta, type StoryObj} from '@storybook/react-webpack5';

import Link from '../link/link';
import Breadcrumbs from './breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,

  parameters: {
    docs: {
      importSubpath: 'components/breadcrumbs/breadcrumbs',
      exportName: 'Breadcrumbs',
    },
  },

  argTypes: {
    separatorClassName: {
      control: 'text',
      description: 'Custom separator class',
    },
    children: {
      control: false,
      description: 'Breadcrumb items',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  render: args => (
    <Breadcrumbs {...args}>
      <Link href='/'>First Page</Link>
      <Link href='/'>Second Page</Link>
      <Link href='/'>Third Page</Link>
      <Link href='/' active>
        Current Page
      </Link>
    </Breadcrumbs>
  ),
};

export const CustomSeparator: Story = {
  render: args => (
    <Breadcrumbs {...args} separatorClassName='custom-sep'>
      <Link href='/'>Home</Link>
      <Link href='/'>Products</Link>
      <Link href='/' active>
        Details
      </Link>
    </Breadcrumbs>
  ),
  parameters: {
    storyStyles: `
<style>
  .custom-sep {
    margin: 0 12px;
    color: var(--ring-border-accent-color);
  }
</style>`,
  },
};
