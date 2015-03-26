/**
 * @fileoverview Ring 2.0 bundle for Upsource.
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 */

window.React = require('react');

// todo(igor.alexeenko): Require all neede css files here.

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
