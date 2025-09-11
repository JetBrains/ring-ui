import WindowFlow from './window-flow';
import defaultOnBackendDown from './down-notification';
import Auth from './auth-core';

/**
 * @name Auth
 *
 * @prop {object} config
 * @prop {string} config.serverUri
 * @prop {string} config.redirectUri
 * @prop {string} config.clientId
 * @prop {boolean=false} config.redirect — use redirects instead of loading the token in the background.
 * @prop {string[]} config.scope
 * @prop {string[]} config.optionalScopes
 * @prop {boolean} config.cleanHash - whether or not location.hash will be cleaned after authorization is completed.
 * Should be set to false in angular > 1.2.26 apps to prevent infinite redirect in Firefox
 * @prop {User?} user
 * @prop {string[]} config.userFields List of user data fields to be returned by auth.requestUser (default list is used in Header.HeaderHelper)
 * @prop {string[]} config.fetchCredentials
 *
 * @param {{
 *   serverUri: string,
 *   redirectUri: string?,
 *   requestCredentials: string?,
 *   clientId: string?,
 *   scope: string[]?,
 *   optionalScopes: string[]?,
 *   cleanHash: boolean?,
 *   fetchCredentials: string?,
 *   userFields: string[]?
 * }} config
 *
 */

/**
 * Extend Auth config with non-required and not pure-JS stuff
 */
Auth.DEFAULT_CONFIG = {
  ...Auth.DEFAULT_CONFIG,
  EmbeddedLoginFlow: WindowFlow,
  onBackendDown: defaultOnBackendDown,
};

export * from './auth-core';
export default Auth;
