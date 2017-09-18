import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Tooltip from '../tooltip/tooltip';

import UserCard from './card';
import styles from './user-card.css';

export default class UserCardTooltip extends Component {
  static propTypes = {
    children: PropTypes.node,
    user: UserCard.propTypes.user,
    userNameHref: UserCard.propTypes.userNameHref,
    ...Tooltip.propTypes
  };

  static defaultProps = {
    delay: 100,
    hideDelay: 500
  };

  renderUserCard({user, userNameHref}) {
    return (
      <UserCard
        user={user}
        userNameHref={userNameHref}
        className={styles.userCardSpaced}
      />
    );
  }

  render() {
    const {children, user, userNameHref, ...restProps} = this.props;

    return (
      <Tooltip
        title={this.renderUserCard({user, userNameHref})}
        {...restProps}
      >
        {children}
      </Tooltip>
    );
  }
}
