import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import jetbrainsLogo from '@jetbrains/logos/jetbrains/jetbrains.svg';
import Auth from '@jetbrains/ring-ui/components/auth/auth';
import authDialogService from '@jetbrains/ring-ui/components/auth-dialog-service/auth-dialog-service';
import Header, {
  Logo,
  Tray,
  SmartProfile,
  Services
} from '@jetbrains/ring-ui/components/header/header';
import GithubCorner from 'react-github-corner';

/* eslint-disable import/no-unresolved */
import youtrackLogo from '!file-loader?publicPath=./!@jetbrains/logos/youtrack/youtrack.svg';

import upsourceLogo from '!file-loader?publicPath=./!@jetbrains/logos/upsource/upsource.svg';

import teamcityLogo from '!file-loader?publicPath=./!@jetbrains/logos/teamcity/teamcity.svg';
/* eslint-enable */

import styles from './index.css';
import hubConfig from './hub-config';
import Item from './item';
import Version from './version';
import {getIndexDoc} from './utils';

class SiteHeader extends PureComponent {
  async componentDidMount() {
    if (!this.props.noAuth) {
      this.auth.setAuthDialogService(authDialogService);
      const restoreLocation = await this.auth.init();
      if (restoreLocation) {
        window.location = restoreLocation;
      }
    }
  }

  auth = new Auth(hubConfig);

  render() {
    const {docsItems, version} = this.props;
    const indexDoc = getIndexDoc(docsItems);

    return (
      <Header className={styles.header}>
        <a href={indexDoc}>
          <Logo
            className={styles.logo}
            glyph={jetbrainsLogo}
            size={Logo.Size.Size128}
          />
        </a>
        <span className={styles.headerItem}>
          {'Ring UI library '}
          <Version version={version}/>
        </span>
        {docsItems.map(item => (
          <Item
            key={item.title}
            {...item}
          />
        ))}
        <Tray>
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
          <SmartProfile auth={this.auth} size={SmartProfile.Size.Size40}/>
          <div className={styles.githubCorner}>
            <GithubCorner
              href="https://github.com/JetBrains/ring-ui"
              bannerColor="#fff"
              octoColor="#000"
            />
          </div>
        </Tray>
      </Header>
    );
  }
}

SiteHeader.propTypes = {
  version: PropTypes.string,
  noAuth: PropTypes.bool,
  docsItems: PropTypes.arrayOf(PropTypes.shape(Item.propTypes))
};

export default SiteHeader;
