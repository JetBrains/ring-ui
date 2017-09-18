import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Tooltip from '../tooltip/tooltip';

import UserCard from './card';
import styles from './user-card.css';

export default class UserCardTooltip extends Component {
  static propTypes = {
    children: PropTypes.node,
    tooltipProps: PropTypes.object,
    ...UserCard.propTypes
  };

  static defaultProps = {
    tooltipProps: {
      delay: 100,
      hideDelay: 500
    }
  };

  renderUserCard() {
    // eslint-disable-next-line no-unused-vars
    const {className, children, tooltipProps, ...props} = this.props;

    return (
      <UserCard
        {...props}
        className={classNames(styles.userCardSpaced, className)}
      />
    );
  }

  render() {
    const {children, tooltipProps} = this.props;

    return (
      <Tooltip
        title={this.renderUserCard()}
        {...tooltipProps}
      >
        {children}
      </Tooltip>
    );
  }
}
