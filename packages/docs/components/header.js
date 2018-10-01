import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import jetbrainsLogo from '@jetbrains/logos/jetbrains/jetbrains.svg';
import Auth from '@jetbrains/ring-ui/components/auth/auth';
import IFrameFlow from '@jetbrains/ring-ui/components/auth/iframe-flow';
import authDialogService from '@jetbrains/ring-ui/components/auth-dialog-service/auth-dialog-service';
import Header, {
  Logo,
  Tray,
  TrayIcon,
  SmartProfile,
  Services
} from '@jetbrains/ring-ui/components/header/header';

/* eslint-disable import/no-unresolved */
import youtrackLogo from '!file-loader?publicPath=./!@jetbrains/logos/youtrack/youtrack.svg';

import upsourceLogo from '!file-loader?publicPath=./!@jetbrains/logos/upsource/upsource.svg';

import teamcityLogo from '!file-loader?publicPath=./!@jetbrains/logos/teamcity/teamcity.svg';
/* eslint-enable */

import gitHubLogo from 'octicons/build/svg/octoface.svg';

import styles from './index.css';
import hubConfig from './hub-config';
import Version from './version';
import Search from './search';
import {getIndexDoc} from './utils';

class SiteHeader extends PureComponent {
  async componentDidMount() {
    if (!this.props.noAuth) {
      this.auth.setAuthDialogService(authDialogService);
      const restoreLocation = await this.auth.init();
      if (restoreLocation && window.location.href !== restoreLocation) {
        window.location = restoreLocation;
      }
      this.auth.loadCurrentService();
    }
  }

  auth = new Auth({
    ...hubConfig,
    EmbeddedLoginFlow: IFrameFlow
  });

  render() {
    const {version, categories} = this.props;
    const indexDoc = getIndexDoc();

    return (
      <Header className={styles.header}>
        <a href={indexDoc}>
          <Logo
            className={styles.logo}
            glyph={jetbrainsLogo}
            size={Logo.Size.Size96}
          />
        </a>
        <span className={styles.headerItem}>
          {'Version '}
          <Version version={version}/>
        </span>
        <Tray>
          <Search categories={categories}/>
          <a
            href="https://github.com/JetBrains/ring-ui"
            target="_blank"
            title="GitHub repo"
          >
            <TrayIcon tabIndex={-1} icon={gitHubLogo} iconSize={24} aria-label="Services"/>
          </a>
          <Services
            services={[
              {
                id: 'youtrack',
                name: 'Issues',
                iconUrl: youtrackLogo,
                homeUrl: 'https://youtrack.jetbrains.com/issues/RG'
              },
              {
                id: 'upsource',
                name: 'Code review',
                iconUrl: upsourceLogo,
                homeUrl: 'https://upsource.jetbrains.com/ring-ui/view'
              },
              {
                id: 'teamcity',
                name: 'Builds',
                iconUrl: teamcityLogo,
                homeUrl: 'https://teamcity.jetbrains.com/project.html?projectId=JetBrainsUi_RingUi&tab=projectOverview'
              }
            ]}
          />
          <SmartProfile auth={this.auth}/>
        </Tray>
      </Header>
    );
  }
}

SiteHeader.propTypes = {
  version: PropTypes.string,
  noAuth: PropTypes.bool,
  categories: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string,
      title: PropTypes.string
    }))
  }))
};

export default SiteHeader;
