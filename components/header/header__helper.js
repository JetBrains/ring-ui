var when = require('when');
var mixIn = require('mout/object/mixIn');

var PopupMenu = require('popup-menu/popup-menu');

/**
 * @namespace
 */
var HeaderHelper = {};

/**
 * @param {Header} header
 * @param {Auth} auth
 * @param {Object=} params
 * @deprecated
 * @return {Promise}
 */
HeaderHelper.setServicesList = function(header, auth, params) {
  var fields = '?fields=id,name,applicationName,homeUrl,iconUrl';

  header.setProps({
    clientId: header.props.clientId || auth.config.client_id,

    onServicesOpen: function() {
      header.refs['services'].setLoading(true);
    },

    onServicesClose: function() {
      header.refs['services'].setLoading(false);
    }
  });

  function setServicesList(services) {
    if (services.length) {
      header.setProps({
        onServicesOpen: null,
        onServicesClose: null
      });
      header.setServicesList(services);

      if (header.refs['services'].state.loading) {
        header.refs['services'].setOpened(true);
        header.refs['services'].setLoading(false);
      }
    } else {
      header.setMenuItemEnabled(header.constructor.MenuItemType.SERVICES, false);
    }
  }

  return auth.requestToken().then(function(token) {
    auth.getApi('services/header' + fields, token, params).
      catch(function (error) {
        // Fallback to old API
        if (error.response.status === 404) {
          var filterVerifiedServices = function (response) {
            if (!response || !response.services || !response.services.length) {
              return response;
            }

            return response.services.filter(function (service) {
              return service.verified === true;
            });
          };
          return auth.getApi('services' + fields + ',verified', token, params).then(filterVerifiedServices);
        }

        return when.reject(error);
      }).
      then(setServicesList);
  });
};

/**
 * @param {Header} header
 * @param {Auth} auth
 * @param {{ logout: string, profile: string }=} translationsDict
 * @return {Promise}
 */
HeaderHelper.setUserMenu = function(header, auth, translationsDict) {
  translationsDict = mixIn({
    logout: 'Log out',
    profile: 'Profile'
  }, translationsDict);

  var popup = null;

  return auth.requestUser().then(function(response) {
    if (response.guest) {
      HeaderHelper._renderLoginButton(header, auth);
      return;
    }

    if (response.profile && response.profile.avatar && response.profile.avatar.type !== 'defaultavatar') {
      header.setProfilePicture(response.profile.avatar.url);
    }

    header.refs['userMenu'].setTitle(response.name);

    var popupData = [
      {
        label: translationsDict.profile,
        type: PopupMenu.ListProps.Type.LINK,
        target: '_self',
        href: [auth.config.serverUri, 'users/', response.id].join('')
      },
      {
        label: translationsDict.logout,
        type: PopupMenu.ListProps.Type.LINK,
        onClick: function() {
          auth.logout();
        }
      }
    ];

    header.setProps({
      profilePopupData: popupData,

      onUserMenuOpen: function() {
        popup = PopupMenu.render(new PopupMenu({
          anchorElement: header.refs['userMenu'].getDOMNode(),
          corner: PopupMenu.PopupProps.Corner.BOTTOM_RIGHT,
          data: header.props.profilePopupData,
          /* eslint-disable no-bitwise */
          direction: PopupMenu.PopupProps.Direction.DOWN | PopupMenu.PopupProps.Direction.LEFT,
          /* eslint-enable no-bitwise */
          onClose: function() {
            header.refs['userMenu'].setOpened(false);
          }
        }));
      },

      onUserMenuClose: function() {
        popup.remove();
        popup = null;
      }
    });
  }, function (error) {
    // Show login button when something went wrong
    HeaderHelper._renderLoginButton(header, auth);

    return when.reject(error);
  });
};

/**
 * @param {Header} header
 * @param {Auth} auth
 * @private
 */
HeaderHelper._renderLoginButton = function(header, auth) {
  header.setMenuItemEnabled(header.constructor.MenuItemType.USER_MENU, false);
  header.setMenuItemEnabled(header.constructor.MenuItemType.LOGIN, true);

  header.setProps({
    onLoginClick: function() {
      // NB! Doesn't look obvious, but guest is also a user, so to show him
      // the login form we need to log out him first. I believe this is
      // a temporary measure.
      auth.logout();
    }
  });
};

module.exports = HeaderHelper;
