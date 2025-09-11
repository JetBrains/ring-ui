import chevronDownIcon from '@jetbrains/icons/chevron-down';

import {ActiveItemContext} from '../list/list';
import Popup from '../popup/popup';
import PopupMenu from '../popup-menu/popup-menu';
import Button from '../button/button';
import Link from '../link/link';
import Input from '../input/input';
import getUID from '../global/get-uid';
import Dropdown from './dropdown';

export default {
  title: 'Components/Dropdown',

  parameters: {
    notes: 'A stateful popup with a clickable anchor.',

    screenshots: {
      actions: [
        {type: 'click', selector: '[data-test~=ring-dropdown]'},
        {
          type: 'capture',
          name: 'dropdown',
          selector: ['[data-test~=ring-dropdown]', '[data-test~=ring-popup]'],
        },
      ],
    },
  },
};

export const basic = () => (
  <Dropdown anchor='Click me'>
    <Popup>Popup content</Popup>
  </Dropdown>
);

basic.storyName = 'basic';

export const withCustomAnchorAndPopup = () => (
  <Dropdown anchor={<Button delayed>Edit</Button>}>
    <PopupMenu closeOnSelect data={['Cut', 'Copy', 'Paste'].map(label => ({label}))} />
  </Dropdown>
);

export const withCustomAnchorAndPopupAndContentAccessibilityHandling = () => {
  const listId = getUID('popup-menu-list-id');

  return (
    <ActiveItemContext.Provider>
      <Dropdown
        anchor={({active}) => (
          <ActiveItemContext.ValueContext.Consumer>
            {activeItemId => {
              const anchorAriaProps =
                active && activeItemId ? {'aria-owns': listId, 'aria-activedescendant': activeItemId} : {};
              return (
                <Button {...anchorAriaProps} delayed>
                  Edit
                </Button>
              );
            }}
          </ActiveItemContext.ValueContext.Consumer>
        )}
      >
        <PopupMenu
          id={listId}
          ariaLabel='My options menu'
          closeOnSelect
          activateFirstItem
          data={['Cut', 'Copy', 'Paste'].map(label => ({label, key: label.toLowerCase()}))}
        />
      </Dropdown>
    </ActiveItemContext.Provider>
  );
};

withCustomAnchorAndPopup.storyName = 'with custom anchor and popup';

export const withActiveClassName = () => (
  <Dropdown className='chevron' activeClassName='rotated' anchor={<Button title='Details' icon={chevronDownIcon} />}>
    <Popup>Popup content</Popup>
  </Dropdown>
);

withActiveClassName.storyName = 'with activeClassName';

withActiveClassName.parameters = {
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
</style>`,
};

export const withHoverMode = () => (
  <Dropdown anchor='Hover over me' hoverMode>
    <Popup>
      <div>Outer popup</div>
    </Popup>
  </Dropdown>
);

withHoverMode.storyName = 'with hover mode';

export const withHoverModeAndDisabledClickMode = () => (
  <Dropdown anchor={<Link href=''>Hover over me</Link>} clickMode={false} hoverMode>
    <Popup>Popup content</Popup>
  </Dropdown>
);

withHoverModeAndDisabledClickMode.storyName = 'with hover mode and disabled click mode';
withHoverModeAndDisabledClickMode.parameters = {screenshots: {skip: true}};

export const autofocusOnOpen = () => (
  <div>
    <div style={{height: '90vh'}} />
    <Dropdown anchor='Scroll and then click me'>
      <Popup trapFocus autoFocusFirst>
        <Input className='ring-js-shortcuts' />
      </Popup>
    </Dropdown>
    <div style={{height: '50vh'}} />
  </div>
);

autofocusOnOpen.storyName = 'autofocus on open';
autofocusOnOpen.parameters = {screenshots: {skip: true}};

export const renderProps = () => (
  <Dropdown anchor='Click me'>
    {props => (
      <Popup {...props}>
        <Button onClick={props.onCloseAttempt} inline>
          Close
        </Button>
      </Popup>
    )}
  </Dropdown>
);
renderProps.parameters = {screenshots: {skip: true}};
