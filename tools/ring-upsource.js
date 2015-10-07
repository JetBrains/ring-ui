// Ring 2.0 bundle for Upsource

// CSS-only components. Upsource has its own JS implementations of those.
require('button-group/button-group.scss');
require('checkbox/checkbox.scss');
require('scrollbar/scrollbar.scss');
require('tabs/tabs.scss');

module.exports = {
  libs: {
    React: require('react'),
    ReactDOM: require('react-dom'),
    classnames: require('classnames')
  },
  components: {
    Auth: require('auth/auth'),
    Button: require('button/button'),
    Footer: require('footer/footer'),
    Global: require('global/global'),
    Header: require('header/header'),
    Popup: require('popup/popup'),
    PopupMenu: require('popup-menu/popup-menu'),
    QueryAssist: require('query-assist/query-assist'),
    Select: require('select/select')
  }
};
