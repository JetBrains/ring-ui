/* global hubConfig */
const {serverUri, clientId} = hubConfig;

const RING_UI_BASE = '/ring-ui/';
const branch = 'master';

const {origin, pathname} = window.location;
const base = pathname.startsWith(RING_UI_BASE)
  ? `${RING_UI_BASE}${branch}/`
  : '/';

export default {
  reloadOnUserChange: false,
  embeddedLogin: true,
  serverUri,
  clientId,
  requestCredentials: 'skip',
  redirectUri: origin + base // TODO: switch back to landing page when is fixed: https://github.com/storybookjs/storybook/issues/13273
  // redirectUri: `${origin + base}iframe.html?id=utilities-auth--landing-page`
};
