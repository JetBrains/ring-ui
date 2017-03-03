import React, {PropTypes, PureComponent} from 'react';

import Auth from '../auth/auth';

import Profile from './profile';

export default class SmartProfile extends PureComponent {
  static Size = Profile.Size;

  static propTypes = {
    auth: PropTypes.instanceOf(Auth).isRequired,
    className: PropTypes.string,
    translations: Profile.propTypes.translations,
    size: Profile.propTypes.size
  };

  state = {
    user: null,
    size: Profile.defaultProps.size
  }

  componentDidMount() {
    const {auth} = this.props;

    if (auth) {
      auth.requestUser().then(user => {
        this.setState({user});
      });
    }
  }

  render() {
    const {user} = this.state;
    const {auth, ...props} = this.props;

    return (
      <Profile
        onLogin={() => auth.logout()}
        onLogout={() => auth.logout()}
        user={user}
        profileUrl={user ? `${auth.config.serverUri}users/${user.id}` : ''}
        {...props}
      />
    );
  }
}
