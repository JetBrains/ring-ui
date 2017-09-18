import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Tooltip from '../tooltip/tooltip';

import UserCard from './card';
import styles from './user-card.css';

export default class UserCardTooltip extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    tooltipProps: PropTypes.object,
    user: PropTypes.object,
    renderNoUser: PropTypes.func
  };

  static defaultProps = {
    renderNoUser: () => null,
    tooltipProps: {
      delay: 100,
      hideDelay: 500
    }
  };

  renderUserCard() {
    // eslint-disable-next-line no-unused-vars
    const {className, children, renderNoUser, tooltipProps, ...props} = this.props;

    return (
      <UserCard
        {...props}
        className={classNames(styles.userCardSpaced, className)}
      />
    );
  }

  render() {
    const {children, user, renderNoUser, tooltipProps} = this.props;

    return (
      <Tooltip
        title={user ? this.renderUserCard() : renderNoUser()}
        {...tooltipProps}
      >
        {children}
      </Tooltip>
    );
  }
}
