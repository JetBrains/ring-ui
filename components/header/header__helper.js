import {findDOMNode} from 'react-dom';
import PopupMenu from '../popup-menu/popup-menu';

/**
 * filters out non-verified services
 * @param response
 * @returns {*}
 */
function filterVerifiedServices(response) {
  if (!response || !response.services || !response.services.length) {
    return response;
  }

  return response.services.filter(service => service.verified === true);
}

/**
 * @namespace
 */
export default class HeaderHelper {
  /**
   * @param {Header} header
   * @param {Auth} auth
   * @param {Object=} params
   * @deprecated
   * @return {Promise}
   */
  static setServicesList(header, auth, params) {
    const fields = '?fields=id,name,applicationName,homeUrl,iconUrl';

    header.rerender({
      clientId: header.props.clientId || auth.config.client_id,
      onServicesOpen: () => header.refs.services.setLoading(true),
      onServicesClose: () => header.refs.services.setLoading(false)
    });

    function setServicesList(services) {
      if (services.length) {
        header.rerender({
          onServicesOpen: null,
          onServicesClose: null
        });
        header.setServicesList(services);

        if (header.refs.services.state.loading) {
          header.refs.services.setOpened(true);
          header.refs.services.setLoading(false);
        }
      } else {
        header.setMenuItemEnabled(header.constructor.MenuItemType.SERVICES, false);
      }
    }

    return auth.requestToken().then(token => {
      auth.getApi('services/header' + fields, token, params).
        catch(error => {
          // Fallback to old API
          if (error.response.status === 404) {
            return auth.getApi('services' + fields + ',verified', token, params).then(filterVerifiedServices);
          }

          return Promise.reject(error);
        }).
        then(setServicesList);
    });
  }

  /**
   * @param {Header} header
   * @param {Auth} auth
   * @param {{ logout: string, profile: string }=} translationsDict
   * @return {Promise}
   */
  static setUserMenu(header, auth, translationsDict) {
    translationsDict = Object.assign({
      logout: 'Log out',
      profile: 'Profile'
    }, translationsDict);

    let popup = null;

    return auth.requestUser().then(response => {
      if (response.guest) {
        HeaderHelper._renderLoginButton(header, auth);
        return;
      }

      if (response.profile && response.profile.avatar && response.profile.avatar.type !== 'defaultavatar') {
        header.setProfilePicture(response.profile.avatar.url);
      }

      header.refs.userMenu.setTitle(response.name);

      const popupData = [
        {
          label: translationsDict.profile,
          type: PopupMenu.ListProps.Type.LINK,
          target: '_self',
          href: [auth.config.serverUri, 'users/', response.id].join('')
        },
        {
          label: translationsDict.logout,
          type: PopupMenu.ListProps.Type.LINK,
          onClick: () => auth.logout()
        }
      ];

      header.rerender({
        profilePopupData: popupData,

        onUserMenuOpen: () => {
          popup = PopupMenu.renderPopup(PopupMenu.factory({
            anchorElement: findDOMNode(header.refs.userMenu),
            corner: PopupMenu.PopupProps.Corner.BOTTOM_RIGHT,
            data: header.props.profilePopupData,
            direction: PopupMenu.PopupProps.Direction.DOWN | PopupMenu.PopupProps.Direction.LEFT,
            onClose: () => header.refs.userMenu.setOpened(false)
          }));
        },

        onUserMenuClose: () => {
          popup.remove();
          popup = null;
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
}
