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
        <div className={classnames(styles.profileEmpty, className)}>
          <Button
            theme={Button.Theme.DARK}
            primary={true}
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
        size={Size.Size32}
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
          top={-8}
          left={-32}
        />
      </Dropdown>
    );
  }
}
