import {config} from '../package.json';

const serverUri = config.hub;
const clientId = config.clientId;
window.hubConfig = {serverUri, clientId};
