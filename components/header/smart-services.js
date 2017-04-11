import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Auth from '../auth/auth';

import Services from './services';

function noop() {}

export default class SmartServices extends Component {
  static propTypes = {
    auth: PropTypes.instanceOf(Auth).isRequired
  };

  static allFields = 'id,name,applicationName,homeUrl,iconUrl';
  static countFields = 'key';

  state = {
    visible: true,
    loading: false,
    services: null
  }

  stopLoading = () => {
    this.setState({loading: false});
  }

  getServicesContent = () => {
    this.setState({loading: true});

    this.getServices(SmartServices.allFields).then(services => {
      this.setState({services});
      this.stopLoading();
    }).catch(this.stopLoading);
  }

  getServices(fields) {
    const {auth} = this.props;

    return auth.requestToken().
      then(token => auth.getApi(`services/header?fields=${fields}`, token));
  }

  componentDidMount() {
    this.getServices(SmartServices.countFields).then(services => {
      if (!services.length) {
        this.setState({visible: false});
      }
    }).catch(noop);
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
        clientId={auth.config.client_id}
        initShown={true}
        loading={loading}
        onClick={this.getServicesContent}
        services={services}
      />
    );
  }
}
