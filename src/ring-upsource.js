// Ring 2.0 bundle for Upsource

window.React = require('react');

// Standalone CSS files
require('button-group/button-group.scss');
require('scrollbar/scrollbar.scss');
require('tabs/tabs.scss');

module.exports = {
  Auth: require('auth/auth'),
  Button: require('button/button'),
  Footer: require('footer/footer'),
  Global: require('global/global'),
  Header: require('header/header'),
  Popup: require('popup/popup'),
  PopupMenu: require('popup-menu/popup-menu'),
  QueryAssist: require('query-assist/query-assist'),
  Select: require('select/select')
};
