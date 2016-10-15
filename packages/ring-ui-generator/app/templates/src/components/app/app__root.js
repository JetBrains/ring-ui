import React from 'react';
import RingComponent from 'ring-ui/components/ring-component/ring-component';

import Header from 'ring-ui/components/header/header';
import Footer from 'ring-ui/components/footer/footer';
import jetbrainsLogo from 'jetbrains-logos/jetbrains/jetbrains.svg';

export default class AppRoot extends RingComponent {
  render() {
    return (
      <div>
        <Header logo={jetbrainsLogo} />
        <div className="app__content">
          {'App content'}
        </div>
        <Footer />
      </div>
    );
  }
}
