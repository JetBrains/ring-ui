import React, {Component} from 'react';
import PropTypes from 'prop-types';

import UserCardTooltip from './tooltip';

/**
 * @name User Card
 * @category Components
 * @framework React
 * @constructor
 * @description A component displays user details
 * @example-file ./user-card.examples.html
 */

export default class SmartUserCardTooltip extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  state = {
    user: null
  };

  render() {
    const {user} = this.state;
    const {children} = this.props;

    if (!user) {
      return children;
    }

    return (
      <UserCardTooltip user={user}>
        {children}
      </UserCardTooltip>
    );
  }
}

export {default as UserCard} from './card';
export {UserCardTooltip};
