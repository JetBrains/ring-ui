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
      href: PropTypes.string.isRequired
    }).isRequired,

    wording: PropTypes.shape({
      banned: PropTypes.string.isRequired
    })
  };

  static defaultProps = {
    wording: {
      banned: 'banned'
    }
  };

  render() {
    const {children, className, user, wording, ...restProps} = this.props;

    const classes = classNames(className, {});

    return (
      <div className={classes} {...restProps}>
        <div className={styles.userInformationContainer}>
          <Avatar
            size={Size.Size56}
            url={user.avatarUrl}
          />
          <div className={styles.userInformation}>
            <div>
              <Link
                href={user.href}
                className={styles.userName}
              >
                {user.name}
              </Link>
              {
                user.banned &&
                <span
                  className={classNames(badgeStyles.badge, badgeStyles.invalid)}
                  title={user.banReason}
                >{wording.banned}</span>
              }
            </div>
            <div>
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
