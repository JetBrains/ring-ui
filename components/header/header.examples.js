import React from 'react';
import hubLogo from '@jetbrains/logos/hub/hub.svg';
import hubTextLogo from '@jetbrains/logos/hub/hub-text.svg';
import addIcon from '@jetbrains/icons/add-20px';
import giftIcon from '@jetbrains/icons/gift-20px';
import helpIcon from '@jetbrains/icons/help-20px';
import searchIcon from '@jetbrains/icons/search-20px';
import settingsIcon from '@jetbrains/icons/settings-20px';

import reactDecorator from '../../.storybook/react-decorator';
import hubConfig from '../../.storybook/hub-config';

import Link from '@jetbrains/ring-ui/components/link/link';


import DropdownMenu from '@jetbrains/ring-ui/components/dropdown-menu/dropdown-menu';
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
  decorators: [reactDecorator()],

  parameters: {
    component: Header,
    framework: 'react',

    storyStyles: `
<style>
  body {
    margin: 0 !important;
  }
</style>`
  }
};

export const header = ({isCompact, ...args}) => {
  class HeaderDemo extends React.Component {
    render() {
      const auth = new Auth(hubConfig);
      if (!blockAuth) {
        auth.setAuthDialogService(showAuthDialog);
        auth.init();
      }

      const Comp = props => <a {...props}>This is component</a>;
      return (
        <Header {...args} className={isCompact ? 'compactHeader' : ''}>
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
            <DropdownMenu
              data={[{label: 'Test'}, {label: 'Test2'}]}
              anchor={({active, pinned, ...ariaProps}) => (
                <TrayIcon title="Settings" active={active} icon={settingsIcon} {...ariaProps}/>
              )}
              menuProps={{top: -12}}
            />
            <SmartServices auth={auth}/>
            <SmartProfile auth={auth} hasUpdates LinkComponent={Comp}/>
          </Tray>
        </Header>
      );
    }
  }

  return <HeaderDemo/>;
};

header.storyName = 'Header';
header.notes = 'See available presentation options in knobs panel';
header.args = {isCompact: false, theme: Theme.DARK};

header.parameters = {
  storyStyles: `
<style>
body {
  margin: 0 !important;
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
};
