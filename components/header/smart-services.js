import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Auth from '../auth/auth';
import HTTP from '../http/http';

import Services from './services';

function noop() {}

export default class SmartServices extends Component {
  static propTypes = {
    auth: PropTypes.instanceOf(Auth).isRequired
  };

  state = {
    visible: true,
    loading: false,
    services: null
  };

  componentDidMount() {
    const {auth} = this.props;

    this.http = new HTTP(auth, auth.getAPIPath());

    this.getServices(SmartServices.countFields).then(services => {
      if (!services.length) {
        this.setState({visible: false});
      }
    }).catch(noop);
  }

  static allFields = 'id,name,applicationName,homeUrl,iconUrl';
  static countFields = 'key';

  stopLoading = () => {
    this.setState({loading: false});
  };

  getServicesContent = () => {
    this.setState({loading: true});

    this.getServices(SmartServices.allFields).then(services => {
      this.setState({services});
      this.stopLoading();
    }).catch(this.stopLoading);
  };

  getServices(fields) {
    return this.http.get(`services/header?fields=${fields}`);
  }

  render() {
    const {services, visible, loading} = this.state;
    const {auth, ...props} = this.props;

    if (!visible) {
      return null;
    }

    return (
      <Services
        {...props}
        clientId={auth.config.clientId}
        initShown
        loading={loading}
        onClick={this.getServicesContent}
        services={services}
      />
    );
  }
}
