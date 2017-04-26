import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Avatar, {Size} from '../avatar/avatar';
import Button from '../button/button';
import Dropdown from '../dropdown/dropdown';
import PopupMenu from '../popup-menu/popup-menu';

import styles from './header.css';

export default class Profile extends PureComponent {
  static Size = Size;

  static propTypes = {
    className: PropTypes.string,
    loading: PropTypes.bool,
    onLogin: PropTypes.func,
    onLogout: PropTypes.func,
    profileUrl: PropTypes.string,
    LinkComponent: PropTypes.oneOfType([
      PropTypes.instanceOf(Component),
      PropTypes.func,
      PropTypes.string
    ]),
    translations: PropTypes.shape({
      profile: PropTypes.string,
      login: PropTypes.string,
      logout: PropTypes.string
    }),
    user: PropTypes.shape({
      guest: PropTypes.bool,
      profile: PropTypes.object
    }),
    size: PropTypes.number
  };

  static defaultProps = {
    translations: {},
    size: Size.Size32
  }

  render() {
    // eslint-disable-next-line max-len
    const {className, loading, user, profileUrl, LinkComponent, onLogin, onLogout, translations, size, ...props} = this.props;

    if (!user) {
      return (
        <div
          {...props}
          className={classnames(styles.profileEmpty, className)}
        >
          <Avatar size={size}/>
        </div>
      );
    }

    if (user.guest) {
      return (
        <div
          className={classnames(styles.profileEmpty, className)}
        >
          <Button
            theme={Button.Theme.DARK}
            primary={true}
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

    const anchor = (
      <Avatar
        url={user.profile && user.profile.avatar && user.profile.avatar.url}
        size={size}
        round={true}
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
          data={[
            {
              rgItemType: PopupMenu.ListProps.Type.LINK,
              label: translations.profile || 'Profile',
              target: '_self', // Full page reload in Angular
              href: profileUrl,
              LinkComponent
            },
            {
              rgItemType: PopupMenu.ListProps.Type.ITEM,
              label: translations.logout || 'Log out',
              onClick: onLogout
            }
          ]}
          top={-8}
          left={-32}
          sidePadding={32}
        />
      </Dropdown>
    );
  }
}
