import React, {PropTypes, PureComponent} from 'react';
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
    onLogin: PropTypes.func,
    onLogout: PropTypes.func,
    profileUrl: PropTypes.string,
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
    translations: {}
  }

  render() {
    const {className, user, profileUrl, onLogin, onLogout, translations, ...props} = this.props;

    if (!user) {
      return (
        <div
          {...props}
          className={classnames(styles.profileEmpty, className)}
        >
          <Avatar size={Size.Size24} />
        </div>
      );
    }

    if (user.guest) {
      return (
        <Button
          blue={true}
          className={classnames(styles.loginButton, className)}
          data-test="ring-header-login-button"
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
        <PopupMenu data={[
          {
            rgItemType,
            label: translations.profile || 'Profile',
            target: '_self', // Full page reload in Angular
            href: profileUrl
          },
          {
            rgItemType,
            label: translations.logout || 'Log out',
            onClick: onLogout
          }
        ]}
        />
      </Dropdown>
    );
  }
}
