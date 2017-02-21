import React from 'react';

import hubLogo from 'jetbrains-logos/hub/hub.svg';

import Auth from 'ring-ui/components/auth/auth';
import Header, {Tray, SmartProfile, SmartServices} from 'ring-ui/components/header/header';
import Link from 'ring-ui/components/link/link';
import Icon, {Size} from 'ring-ui/components/icon/icon';

import hubConfig from 'ring-ui/site/hub-config';

const auth = new Auth(hubConfig);
auth.init();

export default function SiteHeader() {
  return (
    <Header>
      <Link href="/">
        <Icon
          glyph={hubLogo}
          size={Size.Size48}
        />
      </Link>
      <Link
        active={true}
        href="#"
      >{'Styleguide'}</Link>
      <Tray>
        <SmartServices auth={auth}/>
        <SmartProfile auth={auth}/>
      </Tray>
    </Header>
  );
}
