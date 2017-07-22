import React, {Component} from 'react';
import Header, {
  Logo,
  Tray,
  SmartProfile,
  SmartServices
} from 'ring-ui/components/header/header';
import Auth from 'ring-ui/components/auth/auth';
import Footer from 'ring-ui/components/footer/footer';
import jetbrainsLogo from 'jetbrains-logos/jetbrains/jetbrains.svg';

import styles from './app.css';

export default class AppRoot extends Component {
  componentDidMount() {
    this.auth.init();
  }

  auth = new Auth({
    serverUri: '***REMOVED***/'
  });

  render() {
    return (
      <div>
        <Header>
          <a href="/">
            <Logo
              glyph={jetbrainsLogo}
              size={Logo.Size.Size96}
            />
          </a>
          <Tray>
            <SmartServices auth={this.auth}/>
            <SmartProfile auth={this.auth}/>
          </Tray>
        </Header>
        <div className={styles.content}>
          {'App content'}
        </div>
        <Footer/>
      </div>
    );
  }
}
