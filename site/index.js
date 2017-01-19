import './index.scss';
import 'github-markdown-css/github-markdown.css';
import 'file?name=favicon.ico!jetbrains-logos/hub/favicon.ico';

import highlight from 'highlight.js';
import 'highlight.js/styles/github.css';
import beautify from 'js-beautify';

import 'dom4';
import React from 'react';
import ReactDOM from 'react-dom';

import hubConfig from 'ring-ui/site/hub-config';

import Header from 'ring-ui/components/header-legacy/header-legacy';
import Auth from 'ring-ui/components/auth/auth';

const beautifyOptions = {
  e4x: true, // support JSX
  indent_size: 2 // eslint-disable-line camelcase
};

const beautifyLangMap = {
  js: 'js',
  html: 'html',
  css: 'css',
  scss: 'css'
};

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
        key: 'Styleguide'
      },
      children: 'Styleguide'
    }]}
  />,
  document.query('.app__header')
);

auth.init().then(restoreLocation => {
  if (restoreLocation && restoreLocation !== window.location) {
    window.location = restoreLocation;
    return;
  }

  Header.HeaderHelper.setUserMenu(header, auth);
  Header.HeaderHelper.setServicesList(header, auth);
});

document.addEventListener('DOMContentLoaded', () => {
  // Code highlight & beautify
  Array.from(document.querySelectorAll('pre code')).forEach(node => {
    const code = node.textContent;
    let lang = node.hasAttribute('class') ? node.getAttribute('class').match(/language\-([^\s]*)/) : null;
    lang = Array.isArray(lang) ? lang[1] : null;

    node.textContent = (lang in beautifyLangMap)
      ? beautify[beautifyLangMap[lang]](code, beautifyOptions)
      : code;

    highlight.highlightBlock(node);
  });
});
