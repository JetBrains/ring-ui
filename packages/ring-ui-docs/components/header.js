import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import jetbrainsLogo from '@jetbrains/logos/jetbrains/jetbrains.svg';
import Auth from '@jetbrains/ring-ui/components/auth/auth';
import authDialogService from '@jetbrains/ring-ui/components/auth-dialog-service/auth-dialog-service';
import Header, {
  Tray,
  SmartProfile,
  SmartServices
} from '@jetbrains/ring-ui/components/header/header';
import Link from '@jetbrains/ring-ui/components/link/link';
import Icon from '@jetbrains/ring-ui/components/icon/icon';

import styles from './index.css';
import hubConfig from './hub-config';
import Item from './item';
// import Version from './version';
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
      <Header>
        <Link href={indexDoc}>
          <Icon
            className={styles.logo}
            glyph={jetbrainsLogo}
            size={Icon.Size.Size128}
          />
        </Link>
        <span className={styles.headerItem}>{`Ring UI library ${version}`}</span>
        {docsItems.map(item => (
          <Item
            key={item.title}
            {...item}
          />
        ))}
        <Tray>
          <SmartServices auth={this.auth}/>
          <SmartProfile auth={this.auth}/>
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
