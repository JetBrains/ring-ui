/* eslint-disable react/no-access-state-in-setstate */
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Storage from '../storage/storage';

import UserAgreement from './user-agreement';

const GUEST_SESSION_KEY = 'end-user-agreement-consent';
const ONE_HOUR = 60 * 60 * 1000; // eslint-disable-line no-magic-numbers

export default class SmartUserAgreement extends PureComponent {
  static propTypes = {
    getUser: PropTypes.func.isRequired,
    getAgreement: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    setUserConsent: PropTypes.func.isRequired,
    onAccept: PropTypes.func,
    onDecline: PropTypes.func,
    translations: PropTypes.object
  };

  state = {
    userAgreement: {
      enabled: false,
      majorVersion: 0,
      minorVersion: 0,
      text: ''
    },

    userConsent: {
      accepted: false,
      majorVersion: 0,
      minorVersion: 0
    },

    guest: false
  }

  componentWillMount() {
    this.check();
    this.intervalId = setInterval(this.check, ONE_HOUR);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  storage = new Storage();

  check = async () => {
    const {getUser, getAgreement} = this.props;
    let {userConsent} = this.state;

    const userAgreement = await getAgreement() || this.state.userAgreement;
    const {guest, endUserAgreementConsent} = await getUser();

    if (guest) {
      userConsent = await this.storage.get(GUEST_SESSION_KEY) || userConsent;
    } else {
      userConsent = endUserAgreementConsent || userConsent;
    }

    this.setState({userAgreement, userConsent, guest});
  }

  onAccept = async () => {
    const {guest, userAgreement} = this.state;
    const {setUserConsent, onAccept} = this.props;
    let {userConsent} = this.state;

    if (guest) {
      const {majorVersion, minorVersion} = userAgreement;
      userConsent = {majorVersion, minorVersion, accepted: true};
      await this.storage.set(GUEST_SESSION_KEY, userConsent);
    } else {
      userConsent = await setUserConsent();
    }

    this.setState({userConsent});

    if (onAccept) {
      onAccept();
    }
  };

  onDecline = () => {
    const {auth: {auth}, onDecline} = this.props;

    if (onDecline) {
      onDecline();
    }

    return auth.logout({
      message: 'user-agreement-was-declined'
    });
  };

  render() {
    const {userAgreement, userConsent} = this.state;
    const {translations} = this.props;
    const {onAccept, onDecline} = this;

    const props = {userAgreement, userConsent, onAccept, onDecline, translations};
    return (
      <UserAgreement {...props}/>
    );
  }
}
