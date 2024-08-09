import {Component, ReactElement, ReactNode} from 'react';
import classNames from 'classnames';

import Dropdown, {DropdownAttrs} from '../dropdown/dropdown';
import Popup from '../popup/popup';

import UserCard, {UserCardAttrs, UserCardUser} from './card';
import styles from './user-card.css';

const DEFAULT_TIMEOUT = 300;

interface ChildrenProps {
  active: boolean
  pinned: boolean
}

export interface UserCardTooltipProps extends Omit<UserCardAttrs, 'children' | 'user'> {
  user?: UserCardUser | null | undefined
  children: ReactElement | readonly ReactElement[] | string | ((props: ChildrenProps) => ReactNode)
  dropdownProps: Partial<DropdownAttrs>
  renderUserCard: (props: UserCardAttrs) => ReactNode
  renderNoUser: () => ReactNode
}
export default class UserCardTooltip extends Component<UserCardTooltipProps> {
  static defaultProps = {
    renderUserCard: (props: UserCardAttrs) => {
      const {user, ...restProps} = props;

      return user && (
        <UserCard
          user={user}
          {...restProps}
        />
      );
    },
    renderNoUser: () => '',
    dropdownProps: {
      hoverShowTimeOut: DEFAULT_TIMEOUT,
      hoverHideTimeOut: DEFAULT_TIMEOUT
    }
  };

  render() {
    const {children, renderUserCard, renderNoUser, dropdownProps, user, ...restProps} = this.props;

    return (
      <Dropdown
        anchor={children}
        hoverMode
        clickMode={false}
        {...dropdownProps}
      >
        <Popup attached={false}>
          {
            user
              ? renderUserCard({
                ...restProps,
                user,
                className: classNames(styles.userCardSpaced, this.props.className)
              })
              : renderNoUser()
          }
        </Popup>
      </Dropdown>
    );
  }
}
export type UserCardTooltipAttrs =
  JSX.LibraryManagedAttributes<typeof UserCardTooltip, UserCardTooltipProps>
