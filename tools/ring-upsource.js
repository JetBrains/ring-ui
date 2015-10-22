// Ring 2.0 bundle for Upsource

// CSS-only components. Upsource has its own JS implementations of those.
require('button-group/button-group.scss');
require('checkbox/checkbox.scss');
require('error-page/error-page.scss');
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
    Header: require('header/header'),
    Icon: require('icon/icon'),
    Popup: require('popup/popup'),
    PopupMenu: require('popup-menu/popup-menu'),
    QueryAssist: require('query-assist/query-assist'),
    Select: require('select/select')
  },
  icons: {
    add: require('jetbrains-icons/add.svg'),
    added: require('jetbrains-icons/added.svg'),
    check: require('jetbrains-icons/check.svg'),
    modified: require('jetbrains-icons/modified.svg'),
    removed: require('jetbrains-icons/removed.svg'),
    renamed: require('jetbrains-icons/renamed.svg'),
    stamp: require('jetbrains-icons/stamp.svg'),
    'stamp-o': require('jetbrains-icons/stamp-o.svg')
  }
};
