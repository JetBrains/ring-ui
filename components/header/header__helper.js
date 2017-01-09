import {findDOMNode} from 'react-dom';
import PopupMenu from '../popup-menu/popup-menu';

const LAYOUT = {
  DEFAULT: 'default',
  COMPACT: 'compact'
};

/**
 * @namespace
 */
export default class HeaderHelper {
  static layout = LAYOUT;

  /**
   * @param {Header} header
   * @param {Auth} auth
   * @param {Object=} params
   * @deprecated
   * @return {Promise}
   */
  static setServicesList(header, auth, params) {
    const {SERVICES} = header.constructor.MenuItemType;
    const allFields = 'id,name,applicationName,homeUrl,iconUrl';
    const countFields = 'key';

    function getServices(fields) {
      return auth.requestToken().then(token => auth.getApi(`services/header?fields=${fields}`, token, params));
    }

    function setServicesList(services) {
      // Just in case
      header.setMenuItemEnabled(SERVICES, services.length > 0);

      header.setServicesList(services);
      header.rerender({
        onServicesOpen: null,
        onServicesClose: null
      });

      if (header.refs.services.state.loading) {
        header.refs.services.setOpened(true);
        header.refs.services.setLoading(false);
      }
    }

    header.rerender({
      clientId: header.props.clientId || auth.config.client_id,
      onServicesOpen: () => {
        header.refs.services.setLoading(true);
        getServices(allFields).then(setServicesList);
      },
      onServicesClose: () => header.refs.services.setLoading(false)
    });

    getServices(countFields).then(services => header.setMenuItemEnabled(SERVICES, services.length > 0));
  }

  /**
   * @param {Header} header
   * @param {Auth} auth
   * @param {{ logout: string, profile: string }=} customTranslationsDict
   * @return {Promise}
   */
  static setUserMenu(header, auth, customTranslationsDict) {
    const translationsDict = Object.assign({
      logout: 'Log out',
      profile: 'Profile'
    }, customTranslationsDict);

    let popup = null;

    return auth.requestUser().then(response => {
      if (response.guest) {
        HeaderHelper._renderLoginButton(header, auth);
        return;
      }

      if (response.profile && response.profile.avatar && response.profile.avatar.url) {
        header.setProfilePicture(response.profile.avatar.url);
      }

      header.refs.userMenu.setTitle(response.name);

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

      header.rerender({
        profilePopupData: popupData,

        onUserMenuOpen: () => {
          popup = PopupMenu.renderPopup(PopupMenu.factory({
            anchorElement: findDOMNode(header.refs.userMenu),
            data: header.props.profilePopupData,
            directions: [PopupMenu.PopupProps.Directions.BOTTOM_LEFT],
            onClose: () => header.refs.userMenu.setOpened(false)
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
      HeaderHelper._renderLoginButton(header, auth);
      return Promise.reject(error);
    });
  }

  /**
   * @param {Header} header
   * @param {Auth} auth
   * @private
   */
  static _renderLoginButton(header, auth) {
    header.setMenuItemEnabled(header.constructor.MenuItemType.USER_MENU, false);
    header.setMenuItemEnabled(header.constructor.MenuItemType.LOGIN, true);

    header.rerender({
      // NB! Doesn't look obvious, but guest is also a user, so to show him
      // the login form we need to log out him first. I believe this is
      // a temporary measure.
      onLoginClick: () => auth.logout()
    });
  }

  /**
   * 800px is a threshold when navigation menu should be transformed into popup-menu
   * @returns {string}
   */
  static getLayoutType() {
    let layout = HeaderHelper.layout.DEFAULT;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (windowWidth <= 800) {
      layout = HeaderHelper.layout.COMPACT;
    }
    return layout;
  }
}
