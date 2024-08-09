import {PureComponent} from 'react';

import Auth, {
  USER_CHANGED_EVENT,
  LOGOUT_POSTPONED_EVENT,
  USER_CHANGE_POSTPONED_EVENT, AuthUser
} from '../auth/auth';
import alertService from '../alert-service/alert-service';

import {Size} from '../avatar/avatar';

import Profile, {ProfileAttrs} from './profile';


const CERTIFICATE_MISMATCH_HEADER = 'x-client-certificate-token-mismatch';

export interface SmartProfileProps extends ProfileAttrs {
  auth: Auth
}

interface SmartProfileState {
  user: AuthUser | null | undefined | void,
  size: Size,
  isLogoutPostponed: boolean,
  isUserChangePostponed: boolean
  loading?: boolean
}

export default class SmartProfile extends PureComponent<SmartProfileProps, SmartProfileState> {
  state: SmartProfileState = {
    user: null,
    size: Profile.defaultProps.size,
    isLogoutPostponed: false,
    isUserChangePostponed: false
  };

  componentDidMount() {
    this.requestUser();
  }

  static Size = Profile.Size;

  login = async () => {
    this.setState({loading: true});

    try {
      await this.props.auth.login();
    } catch (err) {
      // do nothing
    } finally {
      this.setState({loading: false});
    }
  };

  logout = () => this.props.auth.logout();

  switchUser = () => this.props.auth.switchUser();

  onRevertPostponement = () => {
    if (this.state.isLogoutPostponed) {
      this.props.auth.login();
    }
    if (this.state.isUserChangePostponed) {
      this.props.auth.updateUser();
    }
  };

  async requestUser() {
    try {
      const {auth} = this.props;
      const user = await auth.requestUser();
      this.checkUserCertificateMismatch(user);
      this.setState({user});

      auth.addListener(USER_CHANGED_EVENT, newUser => {
        this.setState({
          user: newUser,
          isLogoutPostponed: false,
          isUserChangePostponed: false
        });
      });

      auth.addListener(LOGOUT_POSTPONED_EVENT, () => {
        this.setState({isLogoutPostponed: true});
      });

      auth.addListener(USER_CHANGE_POSTPONED_EVENT, () => {
        this.setState({isUserChangePostponed: true});
      });
    } catch (e) {
      // noop
    }
  }

  checkUserCertificateMismatch(user: AuthUser) {
    const {auth, translations} = this.props;
    const userMeta = auth.http.getMetaForResponse(user);
    if (userMeta?.headers?.has(CERTIFICATE_MISMATCH_HEADER)) {
      const message = translations?.certificateMismatch || `You are authenticated as ${user.login || user.name}. To authenticate with the client certificate for your account, log out, then click the "Log in with certificate" option on the login page.`;
      alertService.warning(message, 0);
    }
  }

  render() {
    const {user, loading, isLogoutPostponed, isUserChangePostponed} = this.state;
    const {auth, profileUrl, ...props} = this.props;
    const url = profileUrl || (user ? `${auth.config.serverUri}users/${user.id}` : '');

    return (
      <Profile
        onLogin={this.login}
        onLogout={this.logout}
        onSwitchUser={this.switchUser}
        loading={loading}
        user={user}
        profileUrl={url}
        showApplyChangedUser={isUserChangePostponed}
        showLogIn={isLogoutPostponed}
        showLogOut={!isLogoutPostponed}
        showSwitchUser={auth._canShowDialogs() && !isLogoutPostponed && !isUserChangePostponed}
        onRevertPostponement={this.onRevertPostponement}
        {...props}
      />
    );
  }
}
