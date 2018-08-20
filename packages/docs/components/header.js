import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Icon from '@jetbrains/ring-ui/components/icon';
import jetbrainsLogo from '@jetbrains/logos/jetbrains/jetbrains.svg';
import Auth from '@jetbrains/ring-ui/components/auth/auth';
import IFrameFlow from '@jetbrains/ring-ui/components/auth/iframe-flow';
import authDialogService from '@jetbrains/ring-ui/components/auth-dialog-service/auth-dialog-service';
import Header, {
  Tray,
  SmartProfile,
  Services
} from '@jetbrains/ring-ui/components/header/header';
import Link from '@jetbrains/ring-ui/components/link/link';
import GithubCorner from 'react-github-corner';

/* eslint-disable import/no-unresolved */
import youtrackLogo from '!file-loader?publicPath=./!@jetbrains/logos/youtrack/youtrack.svg';

import upsourceLogo from '!file-loader?publicPath=./!@jetbrains/logos/upsource/upsource.svg';

import teamcityLogo from '!file-loader?publicPath=./!@jetbrains/logos/teamcity/teamcity.svg';
/* eslint-enable */

import styles from './index.css';
import hubConfig from './hub-config';
import Item from './item';
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
    const {docsItems, version} = this.props;
    const indexDoc = getIndexDoc(docsItems);

    return (
      <Header className={styles.header}>
        <Link href={indexDoc}>
          <Icon
            glyph={jetbrainsLogo}
            className={styles.logo}
            size={Icon.Size.Size128}
          />
        </Link>
        <span className={styles.headerItem}>
          {`Version ${version}`}
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
          <SmartProfile auth={this.auth}/>
          <div className={styles.githubCorner}>
            <GithubCorner
              href="https://github.com/JetBrains/ring-ui"
              bannerColor="#000"
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
