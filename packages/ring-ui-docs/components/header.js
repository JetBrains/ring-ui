import React from 'react';
import PropTypes from 'prop-types';
import hubLogo from '@jetbrains/logos/hub/hub.svg';
import Auth from '@jetbrains/ring-ui/components/auth/auth';
import authDialogService from '@jetbrains/ring-ui/components/auth-dialog-service/auth-dialog-service';
import Header, {
  Tray,
  SmartProfile,
  SmartServices
} from '@jetbrains/ring-ui/components/header/header';
import Link from '@jetbrains/ring-ui/components/link/link';
import Icon from '@jetbrains/ring-ui/components/icon/icon';

import hubConfig from './hub-config';
import Item from './item';
// import Version from './version';
import {getIndexDoc} from './utils';

const auth = new Auth(hubConfig);
auth.setAuthDialogService(authDialogService);

async function initAuth() {
  const restoreLocation = await auth.init();
  if (restoreLocation) {
    window.location = restoreLocation;
  }
}

// TODO Remove 'true'
if (true && window.frameElement == null) {
  initAuth();
}

const SiteHeader = ({docsItems, version}) => (
  <Header>
    <Link href={getIndexDoc()}>
      <Icon
        glyph={hubLogo}
        size={Icon.Size.Size48}
      />
    </Link>
    <span>{`Ring UI library ${version}`}</span>
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
  version: PropTypes.string,
  docsItems: PropTypes.arrayOf(PropTypes.shape(Item.propTypes))
};

export default SiteHeader;
