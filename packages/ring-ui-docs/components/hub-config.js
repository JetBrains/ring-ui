/* global hubConfig */

const {serverUri, clientId} = hubConfig;

const RING_UI_BASE = '/ring-ui/';

const {origin, pathname, hash} = window.location;
const base = pathname.startsWith(RING_UI_BASE)
  ? RING_UI_BASE
  : '/';

export default {
  reloadOnUserChange: false,
  windowLogin: true,
  serverUri,
  clientId,
  requestCredentials: 'skip',
  redirectUri: origin + base + hash
};
