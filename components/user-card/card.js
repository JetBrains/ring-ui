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

    getName: PropTypes.func,
    getLogin: PropTypes.func,
    getEmail: PropTypes.func,
    getAvatarUrl: PropTypes.func,
    getHref: PropTypes.func.isRequired,

    user: PropTypes.shape({
      login: PropTypes.string,
      name: PropTypes.string,
      profile: PropTypes.shape({
        avatar: PropTypes.shape({url: PropTypes.string}),
        email: PropTypes.shape({email: PropTypes.string})
      }).isRequired
    }).isRequired
  };

  static defaultProps = {
    getName: user => user.name,
    getLogin: user => user.login,
    getEmail: user => user.profile.email && user.profile.email.email,
    getAvatarUrl: user => user.profile.avatar.url
  };

  render() {
    const {children, className, user,
      getName, getLogin, getEmail, getAvatarUrl, getHref, ...restProps} = this.props;

    const classes = classNames(className, {});

    return (
      <div className={classes} {...restProps}>
        <div className={styles.userInformationContainer}>
          <Avatar
            size={Size.Size56}
            url={getAvatarUrl(user)}
          />
          <div className={styles.userInformation}>
            <Link
              href={getHref(user)}
              className={styles.userName}
            >
              {getName(user)}
            </Link>
            <div>{getLogin(user)}</div>
            {getEmail(user) && <div>{getEmail(user)}</div>}
          </div>
        </div>
        {children}
      </div>
    );
  }
}
