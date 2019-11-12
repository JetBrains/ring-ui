import React, {Component} from 'react';
import PropTypes from 'prop-types';

import LoaderInline from '../loader-inline/loader-inline';

import UserCardTooltip from './tooltip';
import styles from './user-card.css';

export default class SmartUserCardTooltip extends Component {
  static propTypes = {
    children: PropTypes.node,
    userDataSource: PropTypes.func
  };

  state = {
    user: null,
    loading: false
  };

  loadUser = async () => {
    if (this.state.user) {
      return;
    }

    try {
      this.setState({loading: true});
      const user = await this.props.userDataSource();
      this.setState({user});
    } catch (e) {
      // Skip it
    } finally {
      this.setState({loading: false});
    }
  };

  renderNoUser = () => (
    this.state.loading
      ? (
        <div className={styles.userCardSpaced}>
          <LoaderInline/>
        </div>
      )
      : null
  );

  render() {
    const {user} = this.state;
    const {children, userDataSource, ...restProps} = this.props;

    const dropdownProps = {
      onMouseEnter: this.loadUser,
      ...UserCardTooltip.defaultProps.dropdownProps
    };

    return (
      <UserCardTooltip
        user={user}
        renderNoUser={this.renderNoUser}
        dropdownProps={dropdownProps}
        {...restProps}
      >
        {children}
      </UserCardTooltip>
    );
  }
}
