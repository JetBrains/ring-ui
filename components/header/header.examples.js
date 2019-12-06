import React from 'react';
import hubLogo from '@jetbrains/logos/hub/hub.svg';
import hubTextLogo from '@jetbrains/logos/hub/hub-text.svg';

import reactDecorator from '../../.storybook/react-decorator';
import hubConfig from '../../.storybook/hub-config';
import Link from '../link/link';


import PopupMenu from '../popup-menu/popup-menu';
import Dropdown from '../dropdown/dropdown';
import showAuthDialog from '../auth-dialog-service/auth-dialog-service';
import {Add20pxIcon, Gift20pxIcon, Help20pxIcon, Search20pxIcon, Settings20pxIcon} from '../icon';

import Theme from '../global/theme';

import Header from './header';
import Logo from './logo';

import Tray from './tray';
import TrayIcon from './tray-icon';
import SmartServices from './smart-services';
import SmartProfile from './smart-profile';

import {Auth} from '..';

export default {
  title: 'Components|Header',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a configurable page header.',

    storyStyles: `
<style>
  body {
    margin: 0;
  }
</style>`
  }
};

export const basic = () => {
  class HeaderDemo extends React.Component {
    render() {
      const auth = new Auth(hubConfig);
      auth.setAuthDialogService(showAuthDialog);
      auth.init();

      const Comp = props => <a {...props}>This is component</a>;
      return (
        <Header>
          <a title="Hub" href="/">
            <Logo glyph={hubLogo} size={Logo.Size.Size48}/>
          </a>
          <Link active href="#">
            Users
          </Link>
          <Link href="#">Groups</Link>
          <Link href="#">Spaces</Link>
          <Link href="#">Services</Link>
          <Tray>
            <TrayIcon primary title="Create issue" icon={Add20pxIcon}/>
            <TrayIcon title="Help" icon={Help20pxIcon}/>
            <TrayIcon title="What's new" icon={Gift20pxIcon}/>
            <TrayIcon title="Search" icon={Search20pxIcon}/>
            <Dropdown
              anchor={({active}) => (
                <TrayIcon title="Settings" active={active} icon={Settings20pxIcon}/>
              )}
            >
              <PopupMenu top={-12} closeOnSelect data={[{label: 'Test'}, {label: 'Test2'}]}/>
            </Dropdown>
            <SmartServices auth={auth}/>
            <SmartProfile auth={auth} hasUpdates LinkComponent={Comp}/>
          </Tray>
        </Header>
      );
    }
  }

  return <HeaderDemo/>;
};

basic.story = {
  name: 'basic'
};

export const light = () => {
  class LightHeaderDemo extends React.Component {
    render() {
      const auth = new Auth(hubConfig);
      auth.setAuthDialogService(showAuthDialog);
      auth.init();

      const Comp = props => <a {...props}>This is component</a>;

      return (
        <Header theme={Theme.LIGHT}>
          <a title="Hub" href="/">
            <Logo glyph={hubLogo} size={Logo.Size.Size48}/>
          </a>
          <Link active href="#">
            Users
          </Link>
          <Link href="#">Groups</Link>

          <Tray>
            <TrayIcon primary title="Create issue" icon={Add20pxIcon}/>
            <TrayIcon title="Help" icon={Help20pxIcon}/>
            <TrayIcon title="What's new" icon={Gift20pxIcon}/>
            <TrayIcon title="Search" icon={Search20pxIcon}/>
            <Dropdown
              anchor={({active}) => (
                <TrayIcon title="Settings" active={active} icon={Settings20pxIcon}/>
              )}
            >
              <PopupMenu top={-12} closeOnSelect data={[{label: 'Test'}, {label: 'Test2'}]}/>
            </Dropdown>
            <SmartServices auth={auth}/>
            <SmartProfile auth={auth} hasUpdates LinkComponent={Comp}/>
          </Tray>
        </Header>
      );
    }
  }

  return <LightHeaderDemo/>;
};

light.story = {
  name: 'light'
};

export const compact = () => {
  class CompactHeaderDemo extends React.Component {
    render() {
      const auth = new Auth(hubConfig);
      auth.setAuthDialogService(showAuthDialog);
      auth.init();

      return (
        <Header className="header">
          <a title="Hub" href="/">
            <Logo className="logo" glyph={hubTextLogo} size={Logo.Size.Size96}/>
          </a>
          <Link active href="#">
            Users
          </Link>
          <Link href="#">Groups</Link>
          <Link href="#">Spaces</Link>
          <Link href="#">Services</Link>
          <Tray>
            <TrayIcon primary title="Create issue" icon={Add20pxIcon}/>
            <TrayIcon title="Help" icon={Help20pxIcon}/>
            <TrayIcon title="What's new" icon={Gift20pxIcon}/>
            <TrayIcon title="Search" icon={Search20pxIcon}/>
            <Dropdown
              anchor={({active}) => (
                <TrayIcon title="Settings" active={active} icon={Settings20pxIcon}/>
              )}
            >
              <PopupMenu top={-12} closeOnSelect data={[{label: 'Test'}, {label: 'Test2'}]}/>
            </Dropdown>
            <SmartServices auth={auth}/>
            <SmartProfile auth={auth} hasUpdates size={SmartProfile.Size.Size24}/>
          </Tray>
        </Header>
      );
    }
  }

  return <CompactHeaderDemo/>;
};

compact.story = {
  name: 'compact',

  parameters: {
    storyStyles: `
  <style>
    body {
      margin: 0;
    }

    .header.header {
      height: 40px;
    }

    .logo.logo {
      color: #fff;
      position: relative;
      top: -2px;
    }
  </style>`
  }
};
