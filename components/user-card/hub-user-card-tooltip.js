import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Auth from '../auth/auth';
import HTTP from '../http/http';
import LoaderInline from '../loader-inline/loader-inline';

import UserCardTooltip from './tooltip';

const fields = 'id,name,login,profile(email/email,avatar/url)';

export default class HubUserCardTooltip extends Component {
  static propTypes = {
    children: PropTypes.node,
    auth: PropTypes.instanceOf(Auth),
    userDataSource: PropTypes.func,
    userId: PropTypes.string.isRequired,
    tooltipProps: UserCardTooltip.propTypes.tooltipProps
  };

  state = {
    user: null,
    loading: false
  };

  defaultUserDataSource(userId) {
    const {auth} = this.props;
    if (!auth) {
      throw new Error('Either "auth" or "userDataSource" are not provided to HubUserCardTooltip');
    }
    const http = new HTTP(auth);
    return http.get(`${auth.config.serverUri}api/rest/users/${userId}?fields=${fields}`);
  }

  loadUser = async () => {
    if (this.state.user) {
      return;
    }

    const {userId, userDataSource} = this.props;

    try {
      this.setState({loading: true});
      const user = await (userDataSource ? userDataSource() : this.defaultUserDataSource(userId));
      this.setState({user});
    } catch (e) {
      // Skip it
    } finally {
      this.setState({loading: false});
    }
  };

  getHref = user => `${this.props.auth.config.serverUri}users/${user.id}`;

  renderNoUser = () => (
    this.state.loading ? <LoaderInline/> : null
  );

  render() {
    const {user} = this.state;
    // eslint-disable-next-line no-unused-vars
    const {children, tooltipProps, auth, userId, userDataSource, ...restProps} = this.props;

    const mergedTooltipProps = {
      ...UserCardTooltip.defaultProps.tooltipProps,
      ...{onMouseEnter: this.loadUser},
      ...tooltipProps
    };

    return (
      <UserCardTooltip
        user={user}
        renderNoUser={this.renderNoUser}
        tooltipProps={mergedTooltipProps}
        getHref={this.getHref}
        {...restProps}
      >
        {children}
      </UserCardTooltip>
    );
  }
}
