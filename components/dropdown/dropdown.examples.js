import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';
import {ChevronDownIcon} from '../icon';

import Popup from '../popup/popup';
import PopupMenu from '../popup-menu/popup-menu';
import Button from '../button/button';
import Link from '../link/link';
import {Input} from '../input/input';

import Dropdown from './dropdown';

export default {
  title: 'Components|Dropdown',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'A stateful popup with a clickable anchor.',

    hermione: {
      actions: [
        {type: 'click', selector: '[data-test~=ring-dropdown]'},
        {
          type: 'capture',
          name: 'dropdown',
          selector: ['[data-test~=ring-dropdown]', '[data-test~=ring-popup]']
        }
      ]
    }
  }
};

export const basic = () => (
  <Dropdown anchor="Click me">
    <Popup>Popup content</Popup>
  </Dropdown>
);

basic.story = {
  name: 'basic'
};

export const withCustomAnchorAndPopup = () => (
  <Dropdown anchor={<Button delayed>Edit</Button>}>
    <PopupMenu closeOnSelect data={['Cut', 'Copy', 'Paste'].map(label => ({label}))}/>
  </Dropdown>
);

withCustomAnchorAndPopup.story = {
  name: 'with custom anchor and popup'
};

export const withActiveClassName = () => (
  <Dropdown
    className="chevron"
    activeClassName="rotated"
    anchor={<Button icon={ChevronDownIcon}/>}
  >
    <Popup>Popup content</Popup>
  </Dropdown>
);

withActiveClassName.story = {
  name: 'with activeClassName',

  parameters: {
    storyStyles: `
  <style>
    .chevron svg {
      transition: transform 0.3s ease-out;
      transform-origin: 50% 40%;
      transform: rotate(0deg);
    }
    
    .rotated svg {
      transform: rotate(180deg);
    }
  </style>`
  }
};

export const withHoverMode = () => (
  <Dropdown anchor="Hover over me" hoverMode>
    <Popup>
      <div>Outer popup</div>
    </Popup>
  </Dropdown>
);

withHoverMode.story = {
  name: 'with hover mode'
};

export const withHoverModeAndDisabledClickMode = () => (
  <Dropdown anchor={<Link href="">Hover over me</Link>} clickMode={false} hoverMode>
    <Popup>Popup content</Popup>
  </Dropdown>
);

withHoverModeAndDisabledClickMode.story = {
  name: 'with hover mode and disabled click mode',
  parameters: {hermione: {skip: true}}
};

export const autofocusOnOpen = () => (
  <div>
    <div style={{height: '90vh'}}/>
    <Dropdown anchor="Scroll and then click me">
      <Popup>
        <Input autoFocus/>
      </Popup>
    </Dropdown>
    <div style={{height: '50vh'}}/>
  </div>
);

autofocusOnOpen.story = {
  name: 'autofocus on open',
  parameters: {hermione: {skip: true}}
};
