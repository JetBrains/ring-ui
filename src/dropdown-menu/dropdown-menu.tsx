import {
  forwardRef,
  useMemo,
  cloneElement,
  ComponentType,
  ReactElement,
  ReactNode,
  HTMLAttributes,
  SyntheticEvent,
  Ref
} from 'react';
import PropTypes from 'prop-types';

import List, {ActiveItemContext, SelectHandlerParams} from '../list/list';
import Dropdown, {AnchorProps, DropdownAttrs} from '../dropdown/dropdown';
import PopupMenu, {PopupMenuAttrs, PopupMenuProps} from '../popup-menu/popup-menu';
import getUID from '../global/get-uid';
import Anchor from '../dropdown/anchor';

import {isArray} from '../global/typescript-utils';

import {ListDataItem} from '../list/consts';

const {children, ...dropdownPropTypes} = Dropdown.propTypes || {};
const {
  id: idPropType,
  data: dataPropType,
  ariaLabel: ariaLabelPropType,
  onSelect: onSelectPropType
} = (PopupMenu as ComponentType<PopupMenuProps>).propTypes || {};

const defaultAriaLabel = 'Dropdown menu';

export interface DropdownAnchorWrapperProps extends AnchorProps {
  anchor: ReactElement | ReadonlyArray<ReactNode> | string
    | ((props: AnchorProps, ariaProps: HTMLAttributes<HTMLElement>) => ReactElement | null)
  activeListItemId?: string | null | undefined
  listId?: string | undefined
}

function DropdownAnchorWrapper({
  anchor,
  pinned,
  active,
  activeListItemId,
  listId,
  ...restProps
}: DropdownAnchorWrapperProps) {
  const anchorAriaProps = useMemo(() => ({
    ...(listId ? {'aria-haspopup': true} : {}),
    ...(activeListItemId ? {'aria-activedescendant': activeListItemId, 'aria-owns': listId} : {}),
    ...(active ? {'aria-expanded': true} : {})
  }), [active, activeListItemId, listId]);

  const anchorProps = useMemo(
    () => ({active, pinned, ...restProps, ...anchorAriaProps}),
    [pinned, active, restProps, anchorAriaProps]
  );

  const anchorComponentProps = useMemo(
    () => ({...anchorProps, pinned: `${anchorProps.pinned}`}),
    [anchorProps]
  );

  if (typeof anchor === 'string') {
    return (
      <Anchor
        {...anchorComponentProps}
      >{anchor}</Anchor>
    );
  }
  if (typeof anchor === 'function') {
    return anchor(({active, pinned, ...restProps}), anchorAriaProps);
  }
  if (!isArray(anchor)) {
    return cloneElement(
      anchor,
      typeof anchor.type === 'string' ? anchorAriaProps : anchorComponentProps
    );
  }
  return (
    <div {...anchorAriaProps}>{anchor}</div>
  );
}

export interface DropdownMenuProps<T = unknown> extends
  Omit<DropdownAttrs, 'anchor' | 'onSelect' | 'children'> {
  anchor: ReactElement | ReadonlyArray<ReactNode> | string
    | ((props: AnchorProps, ariaProps: HTMLAttributes<HTMLElement>) => ReactElement | null)
  data?: readonly ListDataItem<T>[] | undefined
  ariaLabel?: string | null | undefined
  onSelect?: ((
    item: ListDataItem<T>,
    event: Event | SyntheticEvent,
    params?: SelectHandlerParams,
  ) => void) | undefined
  menuProps?: PopupMenuAttrs<T> | null | undefined
}

DropdownAnchorWrapper.propTypes = {
  anchor: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.func]).isRequired,
  pinned: PropTypes.bool,
  active: PropTypes.bool,
  activeListItemId: PropTypes.string,
  listId: PropTypes.string
};

const DropdownMenu = forwardRef(function DropdownMenu<T = unknown>(
  {id, anchor, ariaLabel, data, onSelect, menuProps, ...restDropdownProps}: DropdownMenuProps<T>,
  forwardedRef: Ref<PopupMenu<T>>
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
          onSelect={onSelect}
          {...menuProps}
        />
      </Dropdown>
    </ActiveItemContext.Provider>
  );
}) as <T = unknown>(props: DropdownMenuProps<T> & { ref?: Ref<PopupMenu> }) => ReactElement | null;

(DropdownMenu as ComponentType<unknown>).propTypes = {
  id: idPropType,
  data: dataPropType,
  ariaLabel: ariaLabelPropType,
  onSelect: onSelectPropType,
  menuProps: PropTypes.object,
  ...dropdownPropTypes
};

export default Object.assign(DropdownMenu, {ListProps: List.ListProps});
