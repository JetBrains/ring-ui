import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Avatar, {Size} from '../avatar/avatar';
import Button from '../button/button';
import Dropdown from '../dropdown/dropdown';
import PopupMenu from '../popup-menu/popup-menu';

import styles from './header.css';

const rgItemType = PopupMenu.ListProps.Type.LINK;

export default class Profile extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    closeOnSelect: PropTypes.bool,
    loading: PropTypes.bool,
    onLogin: PropTypes.func,
    onLogout: PropTypes.func,
    profileUrl: PropTypes.string,
    renderPopupItems: PropTypes.func,
    translations: PropTypes.shape({
      profile: PropTypes.string,
      login: PropTypes.string,
      logout: PropTypes.string
    }),
    user: PropTypes.shape({
      guest: PropTypes.bool,
      profile: PropTypes.object
    })
  };

  static defaultProps = {
    closeOnSelect: true,
    renderPopupItems: items => items,
    translations: {}
  }

  render() {
    const {
      className,
      closeOnSelect,
      loading,
      user,
      profileUrl,
      onLogin,
      onLogout,
      renderPopupItems,
      translations,
      ...props
    } = this.props;

    if (!user) {
      return (
        <div
          {...props}
          className={classnames(styles.profileEmpty, className)}
        >
          <Avatar size={Size.Size24}/>
        </div>
      );
    }

    if (user.guest) {
      return (
        <Button
          blue={true}
          className={classnames(styles.loginButton, className)}
          data-test="ring-header-login-button"
          disabled={loading}
          loader={loading}
          onClick={onLogin}
        >
          {translations.login || 'Log in...'}
        </Button>
      );
    }

    const anchor = (
      <Avatar
        url={user.profile && user.profile.avatar && user.profile.avatar.url}
        size={Size.Size24}
      />
    );

    return (
      <Dropdown
        {...props}
        title={user.name}
        anchor={anchor}
        className={classnames(styles.profile, className)}
      >
        <PopupMenu
          closeOnSelect={closeOnSelect}
          data={renderPopupItems([
            {
              rgItemType,
              label: translations.profile || 'Profile',
              className: styles.profileMenuItem,
              target: '_self', // Full page reload in Angular
              href: profileUrl
            },
            {
              rgItemType,
              label: translations.logout || 'Log out',
              className: styles.profileMenuItem,
              onClick: onLogout
            }
          ])}
        />
      </Dropdown>
    );
  }
}
