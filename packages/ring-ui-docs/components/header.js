import React from 'react';
import PropTypes from 'prop-types';
import hubLogo from 'jetbrains-logos/hub/hub.svg';
import Auth from 'ring-ui/components/auth/auth';
import authDialogService from 'ring-ui/components/auth-dialog-service/auth-dialog-service';
import Header, {
  Logo,
  Tray,
  SmartProfile,
  SmartServices
} from 'ring-ui/components/header/header';

import hubConfig from './hub-config';
import Item from './item';
import Version from './version';

const auth = new Auth(hubConfig);
auth.setAuthDialogService(authDialogService);
auth.init().then(restoreLocation => {
  if (restoreLocation) {
    window.location = restoreLocation;
  }
});

const SiteHeader = ({docsItems, ...restProps}) => (
  <Header>
    <a href="/" >
      <Logo
        glyph={hubLogo}
        size={Logo.Size.Size48}
      />
    </a>
    <span>{'Ring UI library '}<Version {...restProps}/></span>
    {docsItems.map(item => (
      <Item
        key={item.title}
        {...item}
      />
    ))}
    <Tray>
      <SmartServices auth={auth}/>
      <SmartProfile auth={auth}/>
    </Tray>
  </Header>
);

SiteHeader.propTypes = {
  ...Version.propTypes,
  docsItems: PropTypes.arrayOf(PropTypes.shape(Item.propTypes))
};

export default SiteHeader;
