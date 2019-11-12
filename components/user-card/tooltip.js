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
    renderUserCard: PropTypes.func,
    renderNoUser: PropTypes.func
  };

  static defaultProps = {
    renderUserCard: props => {
      const {className,
        children, renderUserCard, renderNoUser, dropdownProps, ...restProps} = props;

      return (
        <UserCard
          {...restProps}
          className={classNames(styles.userCardSpaced, className)}
        />
      );
    },
    renderNoUser: () => null,
    dropdownProps: {
      hoverShowTimeOut: DEFAULT_TIMEOUT,
      hoverHideTimeOut: DEFAULT_TIMEOUT
    }
  };

  render() {
    const {children, user, renderUserCard, renderNoUser, dropdownProps} = this.props;

    return (
      <Dropdown
        anchor={children}
        hoverMode
        clickMode={false}
        {...dropdownProps}
      >
        <Popup attached={false}>
          {user ? renderUserCard(this.props) : renderNoUser()}
        </Popup>
      </Dropdown>
    );
  }
}
