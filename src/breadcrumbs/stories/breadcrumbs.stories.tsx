import {type Meta, type StoryObj} from '@storybook/react-vite';

import Link from '../../link/link';
import Breadcrumbs from '../breadcrumbs';

import styles from './breadcrumbs.stories.module.css';

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
    <Breadcrumbs {...args} separatorClassName={styles.customSep}>
      <Link href='/'>Home</Link>
      <Link href='/'>Products</Link>
      <Link href='/' active>
        Details
      </Link>
    </Breadcrumbs>
  ),
  parameters: {
    screenshots: {skip: true},
  },
};
