import 'dom4';
import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';

import Auth from '../auth/auth';
import HTTP from '../http/http';
import Header from '../header-legacy/header-legacy';
import PopupMenu from '../popup-menu/popup-menu';
import RingComponent from '../ring-component/ring-component';

/**
 * @name Header Auth
 * @category Components
 * @deprecated
 * @description Provides a façade to render Header with authorization elements.
 * Intended to replace HeaderHelper
 * @framework React
 * @example
 <example name="Basic">
   <file name="index.html">
     <div id="header-container"></div>
   </file>

   <file name="index.js">
     import React from 'react';
     import {render} from 'react-dom';

     import Auth from 'ring-ui/components/auth/auth';
     import HeaderAuth from 'ring-ui/components/header-auth/header-auth';
     import hubConfig from 'ring-ui/site/hub-config';

     const auth = new Auth(hubConfig);

     // There's no need to wait
     auth.init();

     render(
       <HeaderAuth
         logo="hub"
         auth={auth}
       />,
       document.querySelector('#header-container')
     );
   </file>
 </example>
 */
export default class HeaderAuth extends RingComponent {
  static propTypes = {
    auth: PropTypes.instanceOf(Auth),
    getServicesParams: PropTypes.object,
    translations: PropTypes.object,
    skipServices: PropTypes.bool,
    skipUserMenu: PropTypes.bool
  };

  state = {};

  setAuthElements() {
    const {auth, skipServices, skipUserMenu} = this.props;

    if (auth && !skipServices && !this.hasSetServicesList) {
      this.setServicesList();
      this.hasSetServicesList = true;
    }
    if (auth && !skipUserMenu && !this.hasSetUserMenu) {
      this.setUserMenu();
      this.hasSetUserMenu = true;
    }
  }

  didMount() {
    this.setAuthElements();
  }

  didUpdate() {
    this.setAuthElements();
  }

  setServicesList() {
    const {auth, getServicesParams} = this.props;
    const {SERVICES} = Header.MenuItemType;
    const allFields = 'id,name,applicationName,homeUrl,iconUrl';
    const countFields = 'key';

    const http = new HTTP(auth, auth.getAPIPath());
    const getServices = fields => http.get(`services/header?fields=${fields}`, getServicesParams);

    const setServicesList = services => {
      // Just in case
      this.header.setMenuItemEnabled(SERVICES, services.length > 0);

      this.setState({
        servicesList: services,
        onServicesOpen: null,
        onServicesClose: null
      });

      this.header.services.setOpened(true);
      this.header.services.setLoading(false);
    };

    this.setState({
      clientId: this.props.clientId || auth.config.client_id,
      onServicesOpen: () => {
        this.header.services.setLoading(true);
        getServices(allFields).then(setServicesList);
      },
      onServicesClose: () => this.header.services.setLoading(false)
    });

    getServices(countFields).
      then(services => this.header.setMenuItemEnabled(SERVICES, services.length > 0));
  }

  setUserMenu() {
    const {auth, translations} = this.props;
    const translationsDict = Object.assign({
      logout: 'Log out',
      profile: 'Profile'
    }, translations);

    let popup = null;

    return auth.requestUser().then(response => {
      if (response.guest) {
        this.renderLoginButton();
        return;
      }

      if (
        response.profile &&
        response.profile.avatar && response.profile.avatar.type !== 'defaultavatar'
      ) {
        this.header.setProfilePicture(response.profile.avatar.url);
      }

      this.header.userMenu.setTitle(response.name);

      const popupData = [
        {
          label: translationsDict.profile,
          rgItemType: PopupMenu.ListProps.Type.LINK,
          target: '_self',
          href: [auth.config.serverUri, 'users/', response.id].join('')
        },
        {
          label: translationsDict.logout,
          rgItemType: PopupMenu.ListProps.Type.LINK,
          onClick: () => auth.logout()
        }
      ];

      this.setState({
        profilePopupData: popupData,

        onUserMenuOpen: () => {
          popup = PopupMenu.renderPopup(PopupMenu.factory({
            anchorElement: findDOMNode(this.header.userMenu),
            data: this.header.props.profilePopupData,
            directions: [PopupMenu.PopupProps.Directions.BOTTOM_LEFT],
            onClose: () => this.header.userMenu.setOpened(false)
          }));
        },

        onUserMenuClose: () => {
          if (popup) {
            popup.remove();
            popup = null;
          }
        }
      });
    }, error => {
      // Show login button when something went wrong
      this.renderLoginButton();
      return Promise.reject(error);
    });
  }

  renderLoginButton() {
    this.header.setMenuItemEnabled(Header.MenuItemType.USER_MENU, false);
    this.header.setMenuItemEnabled(Header.MenuItemType.LOGIN, true);

    this.setState({
      onLoginClick: () => this.props.auth.logout()
    });
  }

  headerRef = el => {
    this.header = el;
  };

  render() {
    // eslint-disable-next-line no-unused-vars, max-len
    const {auth, getServicesParams, translations, skipServices, skipUserMenu, ...headerProps} = this.props;

    return (
      <Header
        ref={this.headerRef}
        {...headerProps}
        {...this.state}
      />
    );
  }
}
