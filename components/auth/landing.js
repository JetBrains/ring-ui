import TokenValidator from './token-validator';
import ResponseParser from './response-parser';
import {DEFAULT_EXPIRES_TIMEOUT} from './auth';
import AuthStorage from './storage';

const parser = new ResponseParser();
const authResponse = parser.getAuthResponseFromURL();

export default async function parseAndStoreResponse(clientId) {
  const storage = new AuthStorage({
    messagePrefix: `${clientId}-message-`,
    stateKeyPrefix: `${clientId}-states-`,
    tokenKey: `${clientId}-token`,
    userKey: `${clientId}-user-`
  });

  if (!authResponse) {
    return;
  }

  const {state: stateId, scope, expiresIn, accessToken} = authResponse;
  const newState = await (stateId && this._storage.getState(stateId)) || {};

  const scopes = scope ? scope.split(' ') : newState.scopes || [];

  const effectiveExpiresIn = expiresIn ? parseInt(expiresIn, 10) : DEFAULT_EXPIRES_TIMEOUT;
  const expires = TokenValidator._epoch() + effectiveExpiresIn;

  await storage.saveToken({accessToken, scopes, expires});
}
