import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Avatar, {Size} from '../avatar/avatar';
import Button from '../button/button';
import Dropdown from '../dropdown/dropdown';
import PopupMenu from '../popup-menu/popup-menu';

import styles from './header.css';

const rgItemType = PopupMenu.ListProps.Type.LINK;

export default class Profile extends PureComponent {
  static Size = Size;

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
      profile: PropTypes.object
    }),
    size: PropTypes.number,
    round: PropTypes.bool,
    showLogIn: PropTypes.bool,
    showLogOut: PropTypes.bool,
    showSwitchUser: PropTypes.bool,
    showApplyChangedUser: PropTypes.bool,
    onRevertPostponement: PropTypes.func
  };

  static defaultProps = {
    closeOnSelect: true,
    renderPopupItems: items => items,
    translations: {},
    size: Size.Size32
  };

  render() {
    const {
      className,
      closeOnSelect,
      hasUpdates,
      loading,
      user,
      profileUrl,
      LinkComponent,
      onLogin,
      onLogout,
      onSwitchUser,
      renderPopupItems,
      onRevertPostponement,
      showApplyChangedUser,
      showLogIn,
      showLogOut,
      showSwitchUser,
      translations,
      size,
      round,
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
      return (
        <div
          className={classNames(styles.profileEmpty, className)}
        >
          <Button
            theme={Button.Theme.DARK}
            primary
            data-test="ring-header-login-button"
            disabled={loading}
            loader={loading}
            onClick={onLogin}
          >
            {translations.login || 'Log in...'}
          </Button>
        </div>
      );
    }

    const anchorClassName = classNames(styles.avatarWrapper, {
      [styles.hasUpdates]: hasUpdates
    });

    const anchor = (
      <div className={anchorClassName}>
        <Avatar
          url={user.profile && user.profile.avatar && user.profile.avatar.url}
          size={size}
        />
      </div>
    );

    const items = [
      showApplyChangedUser && {
        rgItemType,
        label: translations.applyChangedUser || 'Apply changeduser',
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
    ].filter(it => !!it);

    return (
      <Dropdown
        {...props}
        title={user.name}
        anchor={anchor}
        data-test="ring-profile"
        className={classNames(styles.profile, className)}
      >
        <PopupMenu
          closeOnSelect={closeOnSelect}
          data={renderPopupItems(items)}
          left={-2}
          top={-8}
          sidePadding={32}
        />
      </Dropdown>
    );
  }
}
