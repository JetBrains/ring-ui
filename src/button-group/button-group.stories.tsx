import chevronDownIcon from '@jetbrains/icons/chevron-down';
import chevron12pxDownIcon from '@jetbrains/icons/chevron-12px-down';
import pencilIcon from '@jetbrains/icons/pencil';
import helpIcon from '@jetbrains/icons/help';
import userIcon from '@jetbrains/icons/user';

import Button from '../button/button';
import {ControlsHeight, ControlsHeightContext} from '../global/controls-height';
import ButtonGroup, {Caption} from './button-group';

export default {
  title: 'Components/Button Group',

  parameters: {
    notes: 'Allows to group several buttons.',
  },
};

export const buttonGroup = () => (
  <div className='container'>
    <div>
      <ButtonGroup>
        <Button>1st button</Button>
        <Button active>2nd button</Button>
        <Button disabled>3rd button</Button>
        <Button disabled active>
          4th button
        </Button>
        <Button>5th button</Button>
      </ButtonGroup>
    </div>
    <div>
      <ButtonGroup>
        <Button disabled>1st disabled</Button>
        <Button disabled active>
          2nd disabled
        </Button>
        <Button disabled>3rd disabled</Button>
      </ButtonGroup>
    </div>
    <div>
      <Caption>Side:</Caption>
      <ButtonGroup>
        <Button>Left</Button>
        <Button>Right</Button>
      </ButtonGroup>
    </div>
    <div>
      <ButtonGroup>
        <span>
          <Button>1st button</Button>
        </span>
        <span>
          <Button>2nd button</Button>
        </span>
        <Button>3rd button</Button>
      </ButtonGroup>
    </div>
    <div>
      <ButtonGroup label='Icon only group'>
        <Button inline={false} active icon={pencilIcon} aria-label='pencil' />
        <Button inline={false} icon={pencilIcon} aria-label='pencil' />
        <Button inline={false} disabled icon={helpIcon} aria-label='help' />
        <Button inline={false} active disabled icon={helpIcon} aria-label='help' />
        <Button inline={false} icon={userIcon} aria-label='user' />
      </ButtonGroup>
    </div>
    <div>
      <ButtonGroup split>
        <Button>Split</Button>
        <Button short>...</Button>
      </ButtonGroup>
    </div>
    <div>
      <ButtonGroup split>
        <Button href='/'>Arrow</Button>
        <Button inline={false} icon={chevronDownIcon} aria-label='Show options' />
      </ButtonGroup>
    </div>
    <div>
      <ControlsHeightContext.Provider value={ControlsHeight.S}>
        <ButtonGroup split>
          <Button href='/'>Arrow height S</Button>
          <Button inline={false} icon={chevron12pxDownIcon} aria-label='Show options' />
        </ButtonGroup>
      </ControlsHeightContext.Provider>
    </div>
    <div>
      <ButtonGroup split>
        <Button primary>Primary</Button>
        <Button primary short>
          ...
        </Button>
      </ButtonGroup>
    </div>
    <div>
      <ButtonGroup>
        <Button>
          All<span className='info'>3048</span>
        </Button>
        <Button>
          Label<span className='info'>rp34</span>
        </Button>
        <Button>Label 3</Button>
      </ButtonGroup>
    </div>
    <div>
      <ButtonGroup label='Label' help='Help text'>
        <Button>Label 1</Button>
        <Button>Label 2</Button>
        <Button>Label 3</Button>
      </ButtonGroup>
    </div>
  </div>
);

buttonGroup.parameters = {
  storyStyles: `
    <style>
      .container > div {
        margin: 1em 0;
      }
      .info {
        color: var(--ring-secondary-color);
        margin-left: calc(var(--ring-unit) / 2);
      }
    </style>
  `,
};
