import './index.scss';
import 'github-markdown-css/github-markdown.css';
import 'highlight.js/styles/github.css';
import 'file?name=favicon.ico!jetbrains-logos/hub/favicon.ico';

import 'dom4';
import React from 'react';
import ReactDOM from 'react-dom';

import hubConfig from 'ring-ui/site/hub-config';

import Header from 'ring-ui/components/header/header';
import Auth from 'ring-ui/components/auth/auth';

const auth = new Auth(hubConfig);
const header = ReactDOM.render(
  <Header
    enabledMenuItems={{
      [Header.MenuItemType.SETTINGS]: false,
      [Header.MenuItemType.HELP]: false,
      [Header.MenuItemType.SERVICES]: true,
      [Header.MenuItemType.USER_MENU]: true,
      [Header.MenuItemType.LOGIN]: false
    }}
    logo="hub"
    logoTitle="Ring UI Library"
    menu={[{
      component: 'b',
      props: {
        key: 'Styguide'
      },
      children: 'Styguide'
    }]}
  />,
  document.query('.app__header')
);

auth.init().then(restoreLocation => {
  if (restoreLocation) {
    window.location = restoreLocation;
    return;
  }

  Header.HeaderHelper.setUserMenu(header, auth);
  Header.HeaderHelper.setServicesList(header, auth);
});
