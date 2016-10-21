import React from 'react';
import RingComponent from 'ring-ui/components/ring-component/ring-component';

import HeaderAuth from 'ring-ui/components/header-auth/header-auth';
import Auth from 'ring-ui/components/auth/auth';
import Footer from 'ring-ui/components/footer/footer';
import jetbrainsLogo from 'jetbrains-logos/jetbrains/jetbrains.svg';

export default class AppRoot extends RingComponent {
  willMount() {
    this.auth = new Auth({
      serverUri: '***REMOVED***/'
    });
    this.auth.init();
  }

  render() {
    return (
      <div>
        <HeaderAuth
          auth={this.auth}
          logo={jetbrainsLogo}
        />
        <div className="app__content">
          {'App content'}
        </div>
        <Footer />
      </div>
    );
  }
}
