import React from 'react';
import chevronDownIcon from '@jetbrains/icons/chevron-down.svg';

import reactDecorator from '../../.storybook/react-decorator';

import Popup from '@jetbrains/ring-ui/components/popup/popup';
import PopupMenu from '@jetbrains/ring-ui/components/popup-menu/popup-menu';
import Button from '@jetbrains/ring-ui/components/button/button';
import Link from '@jetbrains/ring-ui/components/link/link';
import {Input} from '@jetbrains/ring-ui/components/input/input';

import Dropdown from '@jetbrains/ring-ui/components/dropdown/dropdown';

export default {
  title: 'Components/Dropdown',
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
    anchor={<Button title="Details" icon={chevronDownIcon}/>}
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
      <Popup trapFocus autoFocusFirst>
        <Input className="ring-js-shortcuts"/>
      </Popup>
    </Dropdown>
    <div style={{height: '50vh'}}/>
  </div>
);

autofocusOnOpen.story = {
  name: 'autofocus on open',
  parameters: {hermione: {skip: true}}
};
