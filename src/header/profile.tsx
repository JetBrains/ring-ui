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
import PopupMenu, {PopupMenuAttrs} from '../popup-menu/popup-menu';
import {I18nContext} from '../i18n/i18n-context';

import {ListDataItem} from '../list/consts';
import {AuthUser} from '../auth/auth';

import {isTruthy} from '../global/typescript-utils';

import {ClickableLinkProps} from '../link/clickableLink';

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
  translations?: ProfileTranslations | null | undefined
  size: Size
  renderGuest: (props: ProfileProps) => ReactNode
  hasUpdates?: boolean | null | undefined
  loading?: boolean | undefined
  onLogin?: (() => void) | undefined
  onLogout?: (() => void) | null | undefined
  onSwitchUser?: (() => void) | null | undefined
  profileUrl?: string | undefined
  LinkComponent?: ComponentType<ClickableLinkProps> | null | undefined
  user?: AuthUser | null | undefined | void
  round?: boolean | null | undefined
  showName?: boolean | null | undefined
  showLogIn?: boolean | null | undefined
  showLogOut?: boolean | null | undefined
  showSwitchUser?: boolean | null | undefined
  showApplyChangedUser?: boolean | null | undefined
  onRevertPostponement?: (() => void) | null | undefined,
  menuProps?: PopupMenuAttrs | null | undefined,
  activeClassName?: string | null | undefined
}

export default class Profile extends PureComponent<ProfileProps> {
  static propTypes = {
    className: PropTypes.string,
    activeClassName: PropTypes.string,
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
    showName: PropTypes.bool,
    showLogIn: PropTypes.bool,
    showLogOut: PropTypes.bool,
    showSwitchUser: PropTypes.bool,
    showApplyChangedUser: PropTypes.bool,
    onRevertPostponement: PropTypes.func,
    renderGuest: PropTypes.func,
    menuProps: PropTypes.object
  };

  static defaultProps: ProfileProps = {
    closeOnSelect: true,
    renderPopupItems: items => items,
    size: Size.Size32,
    renderGuest: ({loading, onLogin, className, translations}) => (
      <I18nContext.Consumer>
        {({translate}) => (
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
              {translations?.login ?? translate('login')}
            </Button>
          </div>
        )}
      </I18nContext.Consumer>
    )
  };

  static contextType = I18nContext;
  declare context: React.ContextType<typeof Profile.contextType>;

  static Size = Size;

  render() {
    const {
      className,
      activeClassName,
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
      showName,
      showLogIn,
      showLogOut,
      showSwitchUser,
      renderGuest,
      translations,
      size,
      round,
      loading, onLogin,
      menuProps,
      ...props
    } = this.props;

    const {translate} = this.context;

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

    const avatarWrapper = classNames(styles.avatarWrapper, {
      [styles.hasUpdates]: hasUpdates
    });

    const anchor = (
      <button type="button" className={styles.anchorClassName}>
        <span className={avatarWrapper}>
          <Avatar
            url={user.profile && user.profile.avatar && user.profile.avatar.url}
            size={size}
            round={round}
          />
        </span>
        {showName && <span>{user.name}</span>}
      </button>
    );

    const items = [
      showApplyChangedUser && {
        rgItemType,
        label: translations?.applyChangedUser ?? translate('applyChangedUser'),
        className: styles.profileMenuItem,
        onClick: onRevertPostponement
      },
      showLogIn && {
        rgItemType,
        label: translations?.login ?? translate('login'),
        className: styles.profileMenuItem,
        onClick: onRevertPostponement
      },
      {
        rgItemType: PopupMenu.ListProps.Type.LINK,
        label: translations?.profile ?? translate('profile'),

        target: '_self', // Full page reload in Angular
        href: profileUrl,
        LinkComponent
      },
      showSwitchUser && {
        rgItemType,
        label: translations?.switchUser ?? translate('switchUser'),
        className: styles.profileMenuItem,
        onClick: onSwitchUser
      },
      showLogOut && {
        rgItemType,
        label: translations?.logout ?? translate('logout'),

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
        activeClassName={activeClassName}
        menuProps={{
          closeOnSelect,
          left: -2,
          top: -8,
          sidePadding: 32,
          ...menuProps
        }}
      />
    );
  }
}

export type ProfileAttrs = JSX.LibraryManagedAttributes<typeof Profile, ProfileProps>
