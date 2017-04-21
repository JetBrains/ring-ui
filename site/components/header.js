import React from 'react';
import PropTypes from 'prop-types';
import hubLogo from 'jetbrains-logos/hub/hub.svg';

import Auth from '../../components/auth/auth';
import Header, {Logo, Tray, SmartProfile, SmartServices} from '../../components/header/header';
import Link from '../../components/link/link';
import hubConfig from '../hub-config';

import Item from './item';
import Version from './version';

const auth = new Auth(hubConfig);
auth.init();

const SiteHeader = ({docsItems, ...restProps}) => (
  <Header>
    <Link href="/" >
      <Logo
        glyph={hubLogo}
        size={Logo.Size.Size48}
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
