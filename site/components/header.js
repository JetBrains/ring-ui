import React from 'react';
import PropTypes from 'prop-types';
import hubLogo from 'jetbrains-logos/hub/hub.svg';

import Auth from '../../components/auth/auth';
import Header, {Tray, SmartProfile, SmartServices} from '../../components/header/header';
import Link from '../../components/link/link';
import Icon from '../../components/icon/icon';
import hubConfig from '../hub-config';

import Item from './item';
import Version from './version';

const auth = new Auth(hubConfig);
auth.init().then(restoreLocation => {
  if (restoreLocation) {
    window.location = restoreLocation;
  }
});

const SiteHeader = ({docsItems, ...restProps}) => (
  <Header>
    <Link href="/">
      <Icon
        glyph={hubLogo}
        size={Icon.Size.Size48}
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
      <SmartServices auth={auth} />
      <SmartProfile auth={auth} />
    </Tray>
  </Header>
);

SiteHeader.propTypes = {
  ...Version.propTypes,
  docsItems: PropTypes.arrayOf(PropTypes.shape(Item.propTypes))
};

export default SiteHeader;
