import {Component} from 'react';

import LoaderInline from '../loader-inline/loader-inline';

import UserCardTooltip, {UserCardTooltipAttrs} from './tooltip';
import styles from './user-card.css';
import {UserCardUser} from './card';

export interface SmartUserCardTooltipProps extends UserCardTooltipAttrs {
  userDataSource: () => Promise<UserCardUser | null | undefined> | UserCardUser | null | undefined
}
export default class SmartUserCardTooltip extends Component<SmartUserCardTooltipProps> {
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
      : ''
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
