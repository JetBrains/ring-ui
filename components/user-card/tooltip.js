import React, {Component} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Dropdown from '../dropdown/dropdown';
import Popup from '../popup/popup';

import UserCard from './card';
import styles from './user-card.css';

const DEFAULT_TIMEOUT = 300;

export default class UserCardTooltip extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    dropdownProps: PropTypes.object,
    user: PropTypes.object,
    renderNoUser: PropTypes.func
  };

  static defaultProps = {
    renderNoUser: () => null,
    dropdownProps: {
      hoverShowTimeOut: DEFAULT_TIMEOUT,
      hoverHideTimeOut: DEFAULT_TIMEOUT
    }
  };

  renderUserCard() {
    // eslint-disable-next-line no-unused-vars
    const {className, children, renderNoUser, dropdownProps, ...props} = this.props;

    return (
      <UserCard
        {...props}
        className={classNames(styles.userCardSpaced, className)}
      />
    );
  }

  render() {
    const {children, user, renderNoUser, dropdownProps} = this.props;

    return (
      <Dropdown
        anchor={children}
        hoverMode={true}
        clickMode={false}
        {...dropdownProps}
      >
        <Popup attached={false}>
          {user ? this.renderUserCard() : renderNoUser()}
        </Popup>
      </Dropdown>
    );
  }
}
