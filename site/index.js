import './index.scss';
import 'github-markdown-css/github-markdown.css';
import 'file-loader?name=favicon.ico!jetbrains-logos/hub/favicon.ico';

import highlight from 'highlight.js';
import 'highlight.js/styles/github.css';
import beautify from 'js-beautify';

import 'dom4';
import React from 'react';
import ReactDOM from 'react-dom';

import hubConfig from 'ring-ui/site/hub-config';

import Header, {Logo, Tray, SmartProfile, SmartServices} from 'ring-ui/components/header/header';
import Auth from 'ring-ui/components/auth/auth';

import hubLogo from 'jetbrains-logos/hub/hub.svg';

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
auth.init();
ReactDOM.render(
  <Header>
    <Logo
      glyph={hubLogo}
      href="/"
    />
    <Tray>
      <SmartServices auth={auth}/>
      <SmartProfile auth={auth}/>
    </Tray>
  </Header>,
  document.query('.app__header')
);

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
