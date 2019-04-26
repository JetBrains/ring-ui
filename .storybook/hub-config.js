/* global hubConfig */
const {serverUri, clientId} = hubConfig;

export default {
  reloadOnUserChange: false,
  embeddedLogin: true,
  serverUri,
  clientId,
  requestCredentials: 'skip',
  redirectUri: window.location.href
};
