/* global hubConfig */
import {getIndexDoc} from './utils';

const {serverUri, clientId} = hubConfig;

export default {
  reloadOnUserChange: false,
  windowLogin: true,
  serverUri,
  clientId,
  requestCredentials: 'skip',
  redirectUri: window.location.href.replace(/\/[^\/]+.html$/, `/${getIndexDoc()}`)
};
