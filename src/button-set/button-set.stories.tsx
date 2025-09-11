import Button from '../button/button';
import ButtonSet from './button-set';

export default {
  title: 'Components/Button Set',

  parameters: {
    notes: 'Allows to group several buttons and ensures that margins between them are consistent.',
  },
};

export const buttonSet = () => (
  <ButtonSet>
    <Button>1st button</Button>
    <Button>2nd button</Button>
    <Button>3rd button</Button>
  </ButtonSet>
);
