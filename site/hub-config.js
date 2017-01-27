/* global hubConfig */

const {serverUri, clientId} = hubConfig;
const {protocol, host} = window.location;

/* eslint-disable camelcase */
export default {
  serverUri,
  client_id: clientId,
  request_credentials: 'skip',
  redirect_uri: `${protocol}//${host}`
};
/* eslint-enable camelcase */
