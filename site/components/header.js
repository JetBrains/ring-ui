import React from 'react';
import PropTypes from 'prop-types';

import hubLogo from 'jetbrains-logos/hub/hub.svg';

import Auth from 'ring-ui/components/auth/auth';
import Header, {Tray, SmartProfile, SmartServices} from 'ring-ui/components/header/header';
import Link from 'ring-ui/components/link/link';
import Icon, {Size} from 'ring-ui/components/icon/icon';

import hubConfig from 'ring-ui/site/hub-config';

import Item from './item';
import Version from './version';

const auth = new Auth(hubConfig);
auth.init();

const SiteHeader = ({docsItems, ...restProps}) => (
  <Header>
    <Link href="/">
      <Icon
        glyph={hubLogo}
        size={Size.Size48}
      />
    </Link>
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
