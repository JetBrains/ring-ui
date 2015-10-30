// Ring 2.0 bundle for Upsource

// CSS-only components. Upsource has its own JS implementations of those.
require('../components/button-group/button-group.scss');
require('../components/checkbox/checkbox.scss');
require('../components/error-page/error-page.scss');
require('../components/scrollbar/scrollbar.scss');
require('../components/tabs/tabs.scss');

module.exports = {
  libs: {
    React: require('react'),
    ReactDOM: require('react-dom'),
    classnames: require('classnames')
  },
  components: {
    Auth: require('../components/auth/auth'),
    Button: require('../components/button/button'),
    Footer: require('../components/footer/footer'),
    Header: require('../components/header/header'),
    Icon: require('../components/icon/icon'),
    Loader: require('../components/loader/loader'),
    LoaderInline: require('../components/loader-inline/loader-inline'),
    Popup: require('../components/popup/popup'),
    PopupMenu: require('../components/popup-menu/popup-menu'),
    QueryAssist: require('../components/query-assist/query-assist'),
    Select: require('../components/select/select')
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
