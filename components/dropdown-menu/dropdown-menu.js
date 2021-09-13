import React, {useMemo, cloneElement} from 'react';
import PropTypes from 'prop-types';

import List, {ActiveItemContext} from '../list/list';
import Dropdown from '../dropdown/dropdown';
import PopupMenu from '../popup-menu/popup-menu';
import getUID from '../global/get-uid';
import Anchor from '../dropdown/anchor';

const {children, ...dropdownPropTypes} = Dropdown.propTypes || {};
const {
  id: idPropType,
  data: dataPropType,
  ariaLabel: ariaLabelPropType,
  ...menuPropTypes
} = Dropdown.propTypes || {};

const defaultAriaLabel = 'Dropdown menu';

function DropdownAnchorWrapper({anchor, pinned, active, activeListItemId, listId, ...restProps}) {
  const anchorAriaProps = useMemo(() => (
    active && activeListItemId
      ? {'aria-owns': listId, 'aria-activedescendant': activeListItemId}
      : {}
  ), [active, activeListItemId, listId]);

  const anchorProps = useMemo(
    () => ({active, pinned, ...restProps, ...anchorAriaProps}),
    [pinned, active, restProps, anchorAriaProps]
  );

  if (typeof anchor === 'string') {
    return (
      <Anchor
        {...anchorProps}
        pinned={`${pinned}`}
      >{anchor}</Anchor>
    );
  }
  if (typeof anchor === 'function') {
    return anchor(anchorProps);
  }
  if (typeof anchor?.type !== 'string' && !Array.isArray(anchor)) {
    return cloneElement(anchor, anchorProps);
  }
  return (
    <div {...anchorAriaProps}>{anchor}</div>
  );
}

DropdownAnchorWrapper.propTypes = {
  anchor: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.func]).isRequired,
  pinned: PropTypes.bool,
  active: PropTypes.bool,
  activeListItemId: PropTypes.string,
  listId: PropTypes.string
};

const DropdownMenu = React.forwardRef(function DropdownMenu(
  {id, anchor, ariaLabel, data, menuExtendedProps, ...restDropdownProps},
  forwardedRef
) {
  const listId = useMemo(() => id || getUID('dropdown-menu-list'), [id]);

  return (
    <ActiveItemContext.Provider>
      <Dropdown
        anchor={({pinned, active, ...restAnchorProps}) => (
          <ActiveItemContext.ValueContext.Consumer>
            {activeItemId => (
              <DropdownAnchorWrapper
                anchor={anchor}
                pinned={pinned}
                active={active}
                activeListItemId={activeItemId}
                listId={listId}
                {...restAnchorProps}
              />
            )}
          </ActiveItemContext.ValueContext.Consumer>
        )}
        {...restDropdownProps}
      >
        <PopupMenu
          ref={forwardedRef}
          id={listId}
          ariaLabel={ariaLabel || defaultAriaLabel}
          closeOnSelect
          activateFirstItem
          data={data}
          {...menuExtendedProps}
        />
      </Dropdown>
    </ActiveItemContext.Provider>
  );
});

DropdownMenu.propTypes = {
  id: idPropType,
  data: dataPropType,
  ariaLabel: ariaLabelPropType,
  menuExtendedProps: menuPropTypes,
  ...dropdownPropTypes
};

DropdownMenu.ListProps = List.ListProps;

export default DropdownMenu;
