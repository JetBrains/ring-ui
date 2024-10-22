declare const hubConfig: {
  serverUri: string;
  clientId: string;
};
const {serverUri, clientId} = hubConfig;

const RING_UI_BASE = '/ring-ui/';
const branch = 'master';

const {origin, pathname} = window.location;
const base = pathname.startsWith(RING_UI_BASE) ? `${RING_UI_BASE}${branch}/` : '/';

export default {
  reloadOnUserChange: false,
  embeddedLogin: true,
  serverUri,
  clientId,
  requestCredentials: 'skip',
  redirectUri: `${origin + base}iframe.html?id=utilities-auth--basic`,
};
