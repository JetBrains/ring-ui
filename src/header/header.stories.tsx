import {Component} from 'react';
import hubLogo from '@jetbrains/logos/hub/hub.svg';
import hubTextLogo from '@jetbrains/logos/hub/hub-text.svg';
import teamcityLogo from '@jetbrains/logos/teamcity/teamcity.svg';
import addIcon from '@jetbrains/icons/add-20px';
import giftIcon from '@jetbrains/icons/gift-20px';
import helpIcon from '@jetbrains/icons/help-20px';
import searchIcon from '@jetbrains/icons/search-20px';
import settingsIcon from '@jetbrains/icons/settings-20px';
import folderIcon from '@jetbrains/icons/folder-20px';
import changesIcon from '@jetbrains/icons/changes-20px';
import agentsIcon from '@jetbrains/icons/agents-20px';
import hourglassIcon from '@jetbrains/icons/hourglass-20px';
import bellIcon from '@jetbrains/icons/bell-20px';


import {StoryFn} from '@storybook/react';

import hubConfig from '../../.storybook/hub-config';

import Link from '../link/link';


import DropdownMenu from '../dropdown-menu/dropdown-menu';
import showAuthDialog from '../auth-dialog-service/auth-dialog-service';

import Theme from '../global/theme';

import Auth from '../auth/auth';

import {ClickableLinkProps} from '../link/clickableLink';

import Header, {HeaderAttrs, Profile} from './header';
import Logo from './logo';

import Tray from './tray';
import HeaderIcon from './header-icon';
import SmartServices from './smart-services';
import SmartProfile from './smart-profile';
import Links from './links';

const blockAuth = window.location.search.includes('block-auth');

export default {
  title: 'Components/Header',

  component: Header,
  parameters: {

    storyStyles: `
<style>
  body {
    margin: 0 !important;
  }
</style>`,
    zeplinLink: 'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/6193bc71a88a41a987ba9918'
  },
  tags: ['skip-test']
};

interface HeaderArgs extends HeaderAttrs {
  isCompact: boolean
  dark: boolean
}

export const header: StoryFn<HeaderArgs> = ({isCompact, dark, ...args}) => {
  class HeaderDemo extends Component {
    render() {
      const auth = new Auth(hubConfig);
      if (!blockAuth) {
        auth.setAuthDialogService(showAuthDialog);
        auth.init();
      }

      const Comp = (props: ClickableLinkProps) => <a {...props}>This is component</a>;
      return (
        <Header
          {...args}
          theme={dark ? Theme.DARK : Theme.LIGHT}
          className={isCompact ? 'compactHeader' : ''}
        >
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
            <HeaderIcon primary title="Create issue" icon={addIcon}/>
            <HeaderIcon title="Help" icon={helpIcon}/>
            <HeaderIcon title="What's new" icon={giftIcon}/>
            <HeaderIcon title="Search" icon={searchIcon}/>
            <DropdownMenu
              data={[{label: 'Test'}, {label: 'Test2'}]}
              anchor={({active}, ariaProps) => (
                <HeaderIcon title="Settings" active={active} icon={settingsIcon} {...ariaProps}/>
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

header.parameters = {notes: 'See available presentation options in knobs panel'};
header.args = {isCompact: false, dark: true};

header.parameters = {
  storyStyles: `
<style>
body {
  margin: 0 !important;
}

.compactHeader.compactHeader {
  height: 48px;
}

.compactLogo.compactLogo {
  color: #fff;
  position: relative;
  top: -2px;
}
</style>`
};

export const vertical: StoryFn<HeaderAttrs> = args => (
  <Header vertical spaced={false} className="header" {...args}>
    <a title="Hub" href="/">
      <Logo glyph={teamcityLogo} size={Logo.Size.Size40}/>
    </a>
    <Links>
      <HeaderIcon title="Projects" icon={folderIcon}/>
      <HeaderIcon title="Changes" icon={changesIcon}/>
      <HeaderIcon title="Agents" icon={agentsIcon}/>
      <HeaderIcon title="Queue" icon={hourglassIcon}/>
      <HeaderIcon title="Settings" icon={settingsIcon}/>
    </Links>
    <Tray>
      <HeaderIcon title="Notifications" icon={bellIcon}/>
      <HeaderIcon title="Help" icon={helpIcon}/>
      <Profile round user={{id: '1', login: 'john.doe', name: 'John Doe'}}/>
    </Tray>
  </Header>
);
vertical.parameters = {storyStyles: `
<style>
body {
  margin: 0 !important;
}

.header {
  height: 100vh;
}
</style>
`};
