import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import hubLogo from 'jetbrains-logos/hub/hub.svg';
import Auth from 'ring-ui/components/auth/auth';
import authDialogService from 'ring-ui/components/auth-dialog-service/auth-dialog-service';
import Header, {
  Tray,
  SmartProfile,
  SmartServices
} from 'ring-ui/components/header/header';
import Link from 'ring-ui/components/link/link';
import Icon from 'ring-ui/components/icon/icon';

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
    const {docsItems, ...restProps} = this.props;
    const indexDoc = getIndexDoc(docsItems);

    return (
      <Header>
        <Link href={`/${indexDoc}`}>
          <Icon
            glyph={hubLogo}
            size={Icon.Size.Size48}
          />
        </Link>
        <span>{'Ring UI library '}<Version {...restProps}/></span>
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
  ...Version.propTypes,
  noAuth: PropTypes.bool,
  docsItems: PropTypes.arrayOf(PropTypes.shape(Item.propTypes))
};

export default SiteHeader;
