import {
  forwardRef,
  cloneElement,
  type ReactElement,
  type HTMLAttributes,
  type SyntheticEvent,
  type Ref,
  type ReactNode,
  useState,
} from 'react';

import List, {ActiveItemContext, type SelectHandlerParams} from '../list/list';
import Dropdown, {type AnchorProps, type DropdownAttrs, type DropdownChildrenFunction} from '../dropdown/dropdown';
import PopupMenu, {type PopupMenuAttrs} from '../popup-menu/popup-menu';
import {type PopupAttrs} from '../popup/popup';
import getUID from '../global/get-uid';
import Anchor from '../dropdown/anchor';
import {isArray} from '../global/typescript-utils';
import {type ListDataItem} from '../list/consts';

const defaultAriaLabel = 'Dropdown menu';

export interface DropdownAnchorWrapperProps extends AnchorProps {
  anchor:
    | ReactElement
    | ReactNode[]
    | string
    | ((props: AnchorProps, ariaProps: HTMLAttributes<HTMLElement>) => ReactElement | null);
  activeListItemId?: string | null | undefined;
  listId?: string | undefined;
}

interface DropdownMenuChildren<T> {
  children?: DropdownChildrenFunction;
  popupMenuProps: {
    ref: Ref<PopupMenu<T>>;
    data: readonly ListDataItem<T>[] | undefined;
    id: string;
    ariaLabel: string;
    closeOnSelect: boolean;
    activateFirstItem: boolean;
    onSelect?: OnSelectHandler<T>;
  } & PopupMenuAttrs<T>;
}

function DropdownAnchorWrapper({
  anchor,
  pinned,
  active,
  activeListItemId,
  listId,
  ...restProps
}: DropdownAnchorWrapperProps) {
  const anchorAriaProps = {
    ...(listId ? {'aria-haspopup': true} : {}),
    ...(activeListItemId ? {'aria-activedescendant': activeListItemId, 'aria-owns': listId} : {}),
    ...(active ? {'aria-expanded': true} : {}),
  };

  const anchorProps = {active, pinned, ...restProps, ...anchorAriaProps};

  const anchorComponentProps = {...anchorProps, pinned: `${anchorProps.pinned}`};

  if (typeof anchor === 'string') {
    return <Anchor {...anchorComponentProps}>{anchor}</Anchor>;
  }
  if (typeof anchor === 'function') {
    return anchor({active, pinned, ...restProps}, anchorAriaProps);
  }
  if (!isArray(anchor)) {
    return cloneElement(anchor, typeof anchor.type === 'string' ? anchorAriaProps : anchorComponentProps);
  }
  return <div {...anchorAriaProps}>{anchor}</div>;
}

function renderDropdownMenuChildren<T>({children, popupMenuProps}: DropdownMenuChildren<T>) {
  if (!children) {
    return <PopupMenu {...popupMenuProps} />;
  }
  return (popupProps: Omit<PopupAttrs, 'children'>) => children({...popupProps, ...popupMenuProps});
}

type OnSelectHandler<T> =
  | ((item: ListDataItem<T>, event: Event | SyntheticEvent, params?: SelectHandlerParams) => void)
  | undefined;

export interface DropdownMenuProps<T = unknown> extends Omit<DropdownAttrs, 'anchor' | 'onSelect' | 'children'> {
  anchor:
    | ReactElement
    | ReactNode[]
    | string
    | ((props: AnchorProps, ariaProps: HTMLAttributes<HTMLElement>) => ReactElement | null);
  data?: readonly ListDataItem<T>[] | undefined;
  ariaLabel?: string | null | undefined;
  onSelect?: OnSelectHandler<T>;
  menuProps?: PopupMenuAttrs<T> | null | undefined;
  children?: DropdownChildrenFunction;
}

const DropdownMenu = forwardRef(function DropdownMenu<T = unknown>(
  {id, anchor, ariaLabel, data, onSelect, menuProps, children, ...restDropdownProps}: DropdownMenuProps<T>,
  forwardedRef: Ref<PopupMenu<T>>,
) {
  const [uid] = useState(() => getUID('dropdown-menu-list'));
  const listId = id || uid;
  const popupMenuProps: DropdownMenuChildren<T>['popupMenuProps'] = {
    ref: forwardedRef,
    id: listId,
    ariaLabel: ariaLabel || defaultAriaLabel,
    closeOnSelect: true,
    activateFirstItem: true,
    data,
    onSelect,
    ...menuProps,
  };

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
        {renderDropdownMenuChildren<T>({children, popupMenuProps})}
      </Dropdown>
    </ActiveItemContext.Provider>
  );
}) as <T = unknown>(props: DropdownMenuProps<T> & {ref?: Ref<PopupMenu>}) => ReactElement | null;

export default Object.assign(DropdownMenu, {ListProps: List.ListProps});
