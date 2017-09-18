import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Avatar, {Size} from '../avatar/avatar';
import Link from '../link/link';

import styles from './user-card.css';

export default class UserCard extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    userNameHref: PropTypes.string.isRequired,
    user: PropTypes.shape({
      login: PropTypes.string,
      name: PropTypes.string,
      profile: PropTypes.shape({
        avatar: PropTypes.shape({url: PropTypes.string}),
        email: PropTypes.shape({email: PropTypes.string})
      }).isRequired
    }).isRequired
  };

  render() {
    const {children, className, user, userNameHref, ...restProps} = this.props;

    const email = user.profile.email && user.profile.email.email;

    const classes = classNames(className, {});

    return (
      <div className={classes} {...restProps}>
        <div className={styles.userInformationContainer}>
          <Avatar
            size={Size.Size56}
            url={user.profile.avatar.url}
          />
          <div className={styles.userInformation}>
            <Link
              href={userNameHref}
              className={styles.userName}
            >
              {user.name}
            </Link>
            <div>{user.login}</div>
            {email && <div>{email}</div>}
          </div>
        </div>
        {children}
      </div>
    );
  }
}
