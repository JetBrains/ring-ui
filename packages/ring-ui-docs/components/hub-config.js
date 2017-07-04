/* global hubConfig */

const {serverUri, clientId} = hubConfig;
const {protocol, host} = window.location;

export default {
  reloadOnUserChange: false,
  windowLogin: true,
  serverUri,
  clientId,
  requestCredentials: 'skip',
  redirectUri: `${protocol}//${host}`
};
