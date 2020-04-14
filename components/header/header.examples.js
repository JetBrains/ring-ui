import React from 'react';
import {withKnobs, boolean, radios} from '@storybook/addon-knobs';
import hubLogo from '@jetbrains/logos/hub/hub.svg';
import hubTextLogo from '@jetbrains/logos/hub/hub-text.svg';
import addIcon from '@jetbrains/icons/add-20px.svg';
import giftIcon from '@jetbrains/icons/gift-20px.svg';
import helpIcon from '@jetbrains/icons/help-20px.svg';
import searchIcon from '@jetbrains/icons/search-20px.svg';
import settingsIcon from '@jetbrains/icons/settings-20px.svg';

import reactDecorator from '../../.storybook/react-decorator';
import hubConfig from '../../.storybook/hub-config';

import Link from '@jetbrains/ring-ui/components/link/link';


import PopupMenu from '@jetbrains/ring-ui/components/popup-menu/popup-menu';
import Dropdown from '@jetbrains/ring-ui/components/dropdown/dropdown';
import showAuthDialog from '@jetbrains/ring-ui/components/auth-dialog-service/auth-dialog-service';

import Theme from '@jetbrains/ring-ui/components/global/theme';

import Auth from '@jetbrains/ring-ui/components/auth/auth';

import Header from '@jetbrains/ring-ui/components/header/header';
import Logo from '@jetbrains/ring-ui/components/header/logo';

import Tray from '@jetbrains/ring-ui/components/header/tray';
import TrayIcon from '@jetbrains/ring-ui/components/header/tray-icon';
import SmartServices from '@jetbrains/ring-ui/components/header/smart-services';
import SmartProfile from '@jetbrains/ring-ui/components/header/smart-profile';

const blockAuth = window.location.search.includes('block-auth');

export default {
  title: 'Components/Header',
  decorators: [reactDecorator(), withKnobs],

  parameters: {
    notes: 'Displays a configurable page header. See available presentation options in the knobs panel.',

    storyStyles: `
<style>
  body {
    margin: 0;
  }
</style>`
  }
};

export const header = () => {
  class HeaderDemo extends React.Component {
    render() {
      const auth = new Auth(hubConfig);
      if (!blockAuth) {
        auth.setAuthDialogService(showAuthDialog);
        auth.init();
      }

      const isCompact = boolean('Compact', false);

      const Comp = props => <a {...props}>This is component</a>;
      return (
        <Header theme={radios('Theme', Theme, Theme.DARK)} className={isCompact ? 'compactHeader' : ''}>
          <a title="Hub" href="/">
            {isCompact
              ? <Logo className="compactLogo" glyph={hubTextLogo} size={Logo.Size.Size96}/>
              : <Logo glyph={hubLogo} size={Logo.Size.Size48}/>
            }
          </a>
          <Link active href="#">
            Users
          </Link>
          <Link href="#">Groups</Link>
          <Link href="#">Spaces</Link>
          <Link href="#">Services</Link>
          <Tray>
            <TrayIcon primary title="Create issue" icon={addIcon}/>
            <TrayIcon title="Help" icon={helpIcon}/>
            <TrayIcon title="What's new" icon={giftIcon}/>
            <TrayIcon title="Search" icon={searchIcon}/>
            <Dropdown
              anchor={({active}) => (
                <TrayIcon title="Settings" active={active} icon={settingsIcon}/>
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

header.story = {
  name: 'basic',
  notes: 'See available presentation options in knobs panel',
  parameters: {
    storyStyles: `
<style>
  body {
    margin: 0;
  }

  .compactHeader.compactHeader {
    height: 40px;
  }

  .compactLogo.compactLogo {
    color: #fff;
    position: relative;
    top: -2px;
  }
</style>`
  }
};
