import TokenValidator from './token-validator';
import ResponseParser from './response-parser';
import Auth, {DEFAULT_EXPIRES_TIMEOUT} from './auth';
import AuthStorage, {AuthState} from './storage';

const parser = new ResponseParser();
const authResponse = parser.getAuthResponseFromURL();

// eslint-disable-next-line consistent-this
export default async function parseAndStoreResponse(this: Auth, clientId: string) {
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
  const newState: AuthState =
    await (stateId && this._storage?.getState(stateId)) || {};

  const scopes = scope ? scope.split(' ') : newState.scopes || [];

  const effectiveExpiresIn = expiresIn ? parseInt(expiresIn, 10) : DEFAULT_EXPIRES_TIMEOUT;
  const expires = TokenValidator._epoch() + effectiveExpiresIn;

  if (accessToken != null) {
    await storage.saveToken({accessToken, scopes, expires});
  }
}
