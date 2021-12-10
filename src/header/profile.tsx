import React, {
  Component,
  ComponentType,
  HTMLAttributes,
  PureComponent,
  ReactNode
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Avatar, {Size} from '../avatar/avatar';
import Button from '../button/button';
import DropdownMenu from '../dropdown-menu/dropdown-menu';
import PopupMenu from '../popup-menu/popup-menu';

import {ListDataItem} from '../list/consts';
import {AuthUser} from '../auth/auth';

import {isTruthy} from '../global/typescript-utils';
import {LinkProps} from '../link/link';

import styles from './header.css';

const rgItemType = PopupMenu.ListProps.Type.LINK;

export interface ProfileTranslations {
  applyChangedUser?: string | null | undefined
  login?: string | null | undefined
  profile?: string | null | undefined
  switchUser?: string | null | undefined
  logout?: string | null | undefined
  certificateMismatch?: string | null | undefined
}

export interface ProfileProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  closeOnSelect: boolean
  renderPopupItems: (items: ListDataItem[]) => readonly ListDataItem[]
  translations: ProfileTranslations
  size: Size
  renderGuest: (props: ProfileProps) => ReactNode
  hasUpdates?: boolean | null | undefined
  loading?: boolean | undefined
  onLogin?: (() => void) | undefined
  onLogout?: (() => void) | null | undefined
  onSwitchUser?: (() => void) | null | undefined
  profileUrl?: string | undefined
  LinkComponent?: ComponentType<LinkProps> | null | undefined
  user?: AuthUser | null | undefined | void
  round?: boolean | null | undefined
  showLogIn?: boolean | null | undefined
  showLogOut?: boolean | null | undefined
  showSwitchUser?: boolean | null | undefined
  showApplyChangedUser?: boolean | null | undefined
  onRevertPostponement?: (() => void) | null | undefined
}

export default class Profile extends PureComponent<ProfileProps> {
  static propTypes = {
    className: PropTypes.string,
    closeOnSelect: PropTypes.bool,
    hasUpdates: PropTypes.bool,
    loading: PropTypes.bool,
    onLogin: PropTypes.func,
    onLogout: PropTypes.func,
    onSwitchUser: PropTypes.func,
    profileUrl: PropTypes.string,
    renderPopupItems: PropTypes.func,
    LinkComponent: PropTypes.oneOfType([
      PropTypes.instanceOf(Component),
      PropTypes.func,
      PropTypes.string
    ]),
    translations: PropTypes.shape({
      profile: PropTypes.string,
      login: PropTypes.string,
      logout: PropTypes.string,
      applyChangedUser: PropTypes.string,
      switchUser: PropTypes.string
    }),
    user: PropTypes.shape({
      guest: PropTypes.bool,
      profile: PropTypes.object,
      name: PropTypes.string
    }),
    size: PropTypes.number,
    round: PropTypes.bool,
    showLogIn: PropTypes.bool,
    showLogOut: PropTypes.bool,
    showSwitchUser: PropTypes.bool,
    showApplyChangedUser: PropTypes.bool,
    onRevertPostponement: PropTypes.func,
    renderGuest: PropTypes.func
  };

  static defaultProps: ProfileProps = {
    closeOnSelect: true,
    renderPopupItems: items => items,
    translations: {},
    size: Size.Size32,
    renderGuest: ({loading, onLogin, className, translations}) => (
      <div
        className={classNames(styles.profileEmpty, className)}
      >
        <Button
          primary
          data-test="ring-header-login-button"
          disabled={loading}
          loader={loading}
          onClick={onLogin}
        >
          {translations.login || 'Log in...'}
        </Button>
      </div>
    )
  };

  static Size = Size;

  render() {
    const {
      className,
      closeOnSelect,
      hasUpdates,
      onLogout,
      user,
      profileUrl,
      LinkComponent,
      onSwitchUser,
      renderPopupItems,
      onRevertPostponement,
      showApplyChangedUser,
      showLogIn,
      showLogOut,
      showSwitchUser,
      renderGuest,
      translations,
      size,
      round,
      loading, onLogin,
      ...props
    } = this.props;

    if (!user) {
      return (
        <div
          {...props}
          className={classNames(styles.profileEmpty, className)}
        >
          <Avatar size={size} round={round}/>
        </div>
      );
    }

    if (user.guest) {
      return renderGuest(this.props);
    }

    const anchorClassName = classNames(styles.avatarWrapper, {
      [styles.hasUpdates]: hasUpdates
    });

    const anchor = (
      <button type="button" className={anchorClassName}>
        <Avatar
          url={user.profile && user.profile.avatar && user.profile.avatar.url}
          size={size}
          round={round}
        />
      </button>
    );

    const items = [
      showApplyChangedUser && {
        rgItemType,
        label: translations.applyChangedUser || 'Apply changed user',
        className: styles.profileMenuItem,
        onClick: onRevertPostponement
      },
      showLogIn && {
        rgItemType,
        label: translations.login || 'Log in',
        className: styles.profileMenuItem,
        onClick: onRevertPostponement
      },
      {
        rgItemType: PopupMenu.ListProps.Type.LINK,
        label: translations.profile || 'Profile',

        target: '_self', // Full page reload in Angular
        href: profileUrl,
        LinkComponent
      },
      showSwitchUser && {
        rgItemType,
        label: translations.switchUser || 'Switch user',
        className: styles.profileMenuItem,
        onClick: onSwitchUser
      },
      showLogOut && {
        rgItemType,
        label: translations.logout || 'Log out',

        onClick: onLogout
      }
    ].filter(isTruthy);

    return (
      <DropdownMenu
        {...props}
        title={user.name}
        anchor={anchor}
        data={renderPopupItems(items)}
        data-test="ring-profile"
        className={classNames(styles.profile, className)}
        menuProps={{
          closeOnSelect,
          left: -2,
          top: -8,
          sidePadding: 32
        }}
      />
    );
  }
}

export type ProfileAttrs = JSX.LibraryManagedAttributes<typeof Profile, ProfileProps>
