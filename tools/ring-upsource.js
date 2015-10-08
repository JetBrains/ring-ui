// Ring 2.0 bundle for Upsource

window.React = require('react');

// CSS-only components. Upsource has its own JS implementations of those.
require('button-group/button-group.scss');
require('checkbox/checkbox.scss');
require('error-page/error-page.scss');
require('scrollbar/scrollbar.scss');
require('tabs/tabs.scss');

module.exports = {
  Auth: require('auth/auth'),
  Button: require('button/button'),
  Footer: require('footer/footer'),
  Header: require('header/header'),
  Popup: require('popup/popup'),
  PopupMenu: require('popup-menu/popup-menu'),
  QueryAssist: require('query-assist/query-assist'),
  Select: require('select/select')
};
