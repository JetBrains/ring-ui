import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import {ChevronDownIcon} from '../icon';
import Dropdown from '../dropdown/dropdown';
import Popup from '../popup/popup';
import PopupMenu from '../popup-menu/popup-menu';
import Button from '../button/button';
import Link from '../link/link';

storiesOf('Components|Dropdown', module).
  addParameters({
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
  }).
  addDecorator(reactDecorator()).
  add('basic', () => (
    <Dropdown
      anchor="Click me"
    >
      <Popup>Popup content</Popup>
    </Dropdown>
  )).
  add('with custom anchor and popup', () => (
    <Dropdown
      anchor={<Button delayed>Edit</Button>}
    >
      <PopupMenu
        closeOnSelect
        data={['Cut', 'Copy', 'Paste'].map(label => ({label}))}
      />
    </Dropdown>
  )).
  add('with activeClassName', () => (
    <Dropdown
      className="chevron"
      activeClassName="rotated"
      anchor={<Button icon={ChevronDownIcon}/>}
    >
      <Popup>Popup content</Popup>
    </Dropdown>
  ), {
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
  }).
  add('with hover mode', () => (
    <Dropdown
      anchor="Hover over me"
      hoverMode
    >
      <Popup>
        <div>Outer popup</div>
        <Popup>Inner popup</Popup>
      </Popup>
    </Dropdown>
  )).
  add('with hover mode and disabled click mode', () => (
    <Dropdown
      anchor={<Link href="">Hover over me</Link>}
      clickMode={false}
      hoverMode
    >
      <Popup>Popup content</Popup>
    </Dropdown>
  ), {hermione: {skip: true}});
