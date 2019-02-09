import WindowFlow from './window-flow';
import defaultOnBackendDown from './down-notification';
import Auth from './auth__core';

/**
 * Extend Auth config with non-required and not pure-JS stuff
 */
Auth.DEFAULT_CONFIG = {
  ...Auth.DEFAULT_CONFIG,
  EmbeddedLoginFlow: WindowFlow,
  onBackendDown: defaultOnBackendDown
};

export * from './auth__core';
export default Auth;
