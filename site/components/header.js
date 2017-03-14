import React, {PropTypes} from 'react';

import hubLogo from 'jetbrains-logos/hub/hub.svg';

import Auth from 'ring-ui/components/auth/auth';
import Header, {Logo, Tray, SmartProfile, SmartServices} from 'ring-ui/components/header/header';

import hubConfig from 'ring-ui/site/hub-config';

import Item from './item';
import Version from './version';

const auth = new Auth(hubConfig);
auth.init();

const SiteHeader = ({docsItems, ...restProps}) => (
  <Header>
    <Logo
      href="/"
      glyph={hubLogo}
      size={Logo.Size.Size48}
    />
    <span>{'Ring UI library '}<Version {...restProps} /></span>
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
