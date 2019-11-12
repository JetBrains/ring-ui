import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Avatar, {Size} from '../avatar/avatar';
import Link from '../link/link';
import badgeStyles from '../badge/badge.css';

import styles from './user-card.css';

export default class UserCard extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,

    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      login: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string.isRequired,
      email: PropTypes.string,
      href: PropTypes.string,
      online: PropTypes.bool,
      banned: PropTypes.bool,
      banReason: PropTypes.string
    }).isRequired,

    wording: PropTypes.shape({
      banned: PropTypes.string.isRequired,
      online: PropTypes.string.isRequired,
      offline: PropTypes.string.isRequired
    })
  };

  static defaultProps = {
    wording: {
      banned: 'banned',
      online: 'online',
      offline: 'offline'
    }
  };

  render() {
    const {children, className, user, wording, ...restProps} = this.props;

    const classes = classNames(className, {});
    const userActiveStatusClasses = classNames(
      styles.userActiveStatus,
      user.online ? styles.online : ''
    );

    return (
      <div className={classes} {...restProps}>
        <div className={styles.userInformationContainer}>
          <Avatar
            size={Size.Size56}
            url={user.avatarUrl}
          />
          <div className={styles.userInformation}>
            <div>
              {user.href && (
                <Link
                  href={user.href}
                  className={styles.userName}
                >
                  {user.name}
                </Link>
              )}
              {!user.href && <span className={styles.userName}>{user.name}</span>}
              {
                user.banned &&
                (
                  <span
                    className={classNames(badgeStyles.badge, badgeStyles.invalid)}
                    title={user.banReason}
                  >{wording.banned}</span>
                )
              }
            </div>
            <div>
              {
                typeof user.online === 'boolean' &&
                (
                  <span
                    className={userActiveStatusClasses}
                    title={user.online ? wording.online : wording.offline}
                  />
                )
              }
              {user.login}
            </div>
            {user.email && <div>{user.email}</div>}
          </div>
        </div>
        {children}
      </div>
    );
  }
}
