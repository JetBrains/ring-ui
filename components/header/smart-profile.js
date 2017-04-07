import React, {PropTypes, PureComponent} from 'react';

import Auth from '../auth/auth';

import Profile from './profile';

export default class SmartProfile extends PureComponent {
  static propTypes = {
    auth: PropTypes.instanceOf(Auth).isRequired,
    className: PropTypes.string,
    translations: Profile.propTypes.translations
  };

  state = {
    user: null
  }

  componentDidMount() {
    const {auth} = this.props;
    // Temporary revert to previous behavior: use logout for login
    this.login = () => auth.logout();
    this.logout = () => auth.logout();

    this.requestUser(auth);
  }

  async requestUser(auth) {
    if (auth) {
      const user = await auth.requestUser();
      this.setState({user});
    }
  }

  render() {
    const {user} = this.state;
    const {auth, ...props} = this.props;

    return (
      <Profile
        onLogin={this.login}
        onLogout={this.logout}
        user={user}
        profileUrl={user ? `${auth.config.serverUri}users/${user.id}` : ''}
        {...props}
      />
    );
  }
}
