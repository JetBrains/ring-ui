import Button from '../button/button';
import ButtonGroup from '../button-group/button-group';
import ButtonToolbar from './button-toolbar';

export default {
  title: 'Components/Button Toolbar',

  parameters: {
    notes: 'Displays a toolbar with several buttons.',
  },
};

export const buttonToolbar = () => (
  <ButtonToolbar>
    <Button primary delayed>
      Run
    </Button>
    <ButtonGroup>
      <Button>Button one</Button>
      <Button>Button two</Button>
      <Button disabled>Button three</Button>
    </ButtonGroup>
    <Button>Another action</Button>
  </ButtonToolbar>
);
