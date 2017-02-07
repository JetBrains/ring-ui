import React, {PropTypes, Component} from 'react';
import classnames from 'classnames';
import getObjectPath from 'get-object-path';

import Auth from '../auth/auth';
import Avatar, {Size} from '../avatar/avatar';
import Button from '../button/button';
import Dropdown from '../dropdown/dropdown';
import PopupMenu from '../popup-menu/popup-menu';

import styles from './header.css';

const rgItemType = PopupMenu.ListProps.Type.LINK;

export default class Profile extends Component {
  static propTypes = {
    auth: PropTypes.instanceOf(Auth).isRequired,
    className: PropTypes.string,
    translations: PropTypes.string
  };

  state = {
    user: null
  }

  componentDidMount() {
    const {auth} = this.props;

    if (auth) {
      auth.requestUser().then(user => {
        this.setState({user});
      });
    }
  }

  render() {
    const {user} = this.state;
    const {className, auth, translations = {}} = this.props;

    if (!user) {
      return (
        <div className={classnames(styles.profile, className)}>
          <Avatar
            size={Size.Size24}
          />
        </div>
      );
    }

    if (user.guest) {
      return (
        <Button
          blue={true}
          className={classnames(styles.loginButton, className)}
          onClick={() => auth.logout()}
        >
          {'Log in...'}
        </Button>
      );
    }

    const anchor = (
      <Avatar
        url={getObjectPath(user, 'profile.avatar.url')}
        size={Size.Size24}
      />
    );

    return (
      <Dropdown
        anchor={anchor}
        className={classnames(styles.profile, className)}
      >
        <PopupMenu data={[
          {
            rgItemType,
            label: translations.profile || 'Profile',
            target: '_self', // Full page reload in Angular
            href: `${auth.config.serverUri}users/${user.id}`
          },
          {
            rgItemType,
            label: translations.logout || 'Log out',
            onClick: () => auth.logout()
          }
        ]}
        />
      </Dropdown>
    );
  }
}
