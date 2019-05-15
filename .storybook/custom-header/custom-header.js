import React, {PureComponent} from 'react';
import {render} from 'react-dom';
import jetbrainsLogo from '@jetbrains/logos/jetbrains/jetbrains.svg';
import gitHubLogo from 'octicons/build/svg/octoface.svg';

/* eslint-disable import/no-unresolved */
import youtrackLogo from '!file-loader?publicPath=./!@jetbrains/logos/youtrack/youtrack.svg';

import upsourceLogo from '!file-loader?publicPath=./!@jetbrains/logos/upsource/upsource.svg';

import teamcityLogo from '!file-loader?publicPath=./!@jetbrains/logos/teamcity/teamcity.svg';
/* eslint-enable */

import packageInfo from '../../package.json';
import Header, {
  Tray,
  TrayIcon,
  Logo,
  Services
} from '../../components/header/header';

import Version from './version';
import styles from './header-styles.css';

class SiteHeader extends PureComponent {

  render() {
    return (
      <Header className={styles.header}>
        <a href="">
          <Logo
            className={styles.logo}
            glyph={jetbrainsLogo}
            size={Logo.Size.Size96}
          />
        </a>

        <span className={styles.headerItem}>
          {'Version '}
          <Version version={packageInfo.version}/>
        </span>

        <Tray>
          <TrayIcon
            icon={gitHubLogo}
            iconSize={24}
            href="https://github.com/JetBrains/ring-ui"
            target="_blank"
            title="GitHub repo"
            aria-label="GitHub repo"
            className={styles.githubIcon}
          />

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
        </Tray>
      </Header>
    );
  }
}

const node = document.createElement('div');
render(<SiteHeader/>, node);
document.body.insertAdjacentElement('afterbegin', node);
