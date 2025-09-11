import {type MockInstance} from 'vitest';

import HTTP from '../http/http';
import LocalStorage from '../storage/storage-local';
import Auth from './auth';
import AuthStorage from './storage';
import TokenValidator from './token-validator';

describe('Auth', () => {
  describe('TokenValidator', () => {
    const storage = new AuthStorage({
      storage: LocalStorage,
    });
    const http = new HTTP();
    const getUser = (token: string) => http.authorizedFetch(Auth.API_PROFILE_PATH, token);
    const tokenValidator = new TokenValidator(
      {
        scope: ['0-0-0-0-0', 'youtrack'],
        optionalScopes: ['youtrack'],
      },
      getUser,
      storage,
    );
    const lifeTime = 60 * 60;
    // eslint-disable-next-line no-underscore-dangle
    const expires = TokenValidator._epoch() + lifeTime;

    describe('getValidatedToken', () => {
      let getToken: MockInstance<AuthStorage['getToken']>;
      beforeEach(function beforeEach() {
        getToken = vi.spyOn(AuthStorage.prototype, 'getToken');
      });

      it('should resolve access token when it is valid', () => {
        getToken.mockReturnValue(
          Promise.resolve({
            accessToken: 'token',
            expires,
            lifeTime,
            scopes: ['0-0-0-0-0', 'youtrack'],
          }),
        );

        return expect(tokenValidator.validateTokenLocally()).to.eventually.be.equal('token');
      });

      it('should resolve access token when token is given for all required scopes', () => {
        getToken.mockReturnValue(
          Promise.resolve({
            accessToken: 'token',
            expires,
            lifeTime,
            scopes: ['0-0-0-0-0'],
          }),
        );

        return expect(tokenValidator.validateTokenLocally()).to.eventually.be.equal('token');
      });

      it('should reject if accessToken is empty', () => {
        getToken.mockReturnValue(
          // @ts-expect-error testing a wrong usage
          Promise.resolve({
            accessToken: null,
            expires,
            lifeTime,
            scopes: ['0-0-0-0-0'],
          }),
        );

        return expect(tokenValidator.validateTokenLocally()).to.be.rejectedWith(
          TokenValidator.TokenValidationError,
          'Token not found',
        );
      });

      it('should reject if there is no token stored', () => {
        getToken.mockReturnValue(Promise.resolve(null));
        return expect(tokenValidator.validateTokenLocally()).to.be.rejectedWith(
          TokenValidator.TokenValidationError,
          'Token not found',
        );
      });

      it('should reject if token is about to be expired (<1/6 lifeTime left)', () => {
        getToken.mockReturnValue(
          Promise.resolve({
            accessToken: 'token',
            // eslint-disable-next-line no-underscore-dangle
            expires: TokenValidator._epoch() + lifeTime / 6 - 1,
            lifeTime,
            scopes: ['0-0-0-0-0'],
          }),
        );
        return expect(tokenValidator.validateTokenLocally()).to.be.rejectedWith(
          TokenValidator.TokenValidationError,
          'Token expired',
        );
      });

      it('should reject if short-life token is about to be expired (<1/6 lifeTime left)', () => {
        const minimalLifeTime = 60 * 5;
        getToken.mockReturnValue(
          Promise.resolve({
            accessToken: 'token',
            // eslint-disable-next-line no-underscore-dangle
            expires: TokenValidator._epoch() + minimalLifeTime / 6 - 1,
            lifeTime: minimalLifeTime,
            scopes: ['0-0-0-0-0'],
          }),
        );
        return expect(tokenValidator.validateTokenLocally()).to.be.rejectedWith(
          TokenValidator.TokenValidationError,
          'Token expired',
        );
      });

      it('should reject if token is about to be expired but lifeTime is not set and default time used', () => {
        getToken.mockReturnValue(
          Promise.resolve({
            accessToken: 'token',
            // eslint-disable-next-line no-underscore-dangle
            expires: TokenValidator._epoch() + 5 * 60,
            scopes: ['0-0-0-0-0'],
          }),
        );
        return expect(tokenValidator.validateTokenLocally()).to.be.rejectedWith(
          TokenValidator.TokenValidationError,
          'Token expired',
        );
      });

      it("should reject if token scopes don't match required scopes", () => {
        getToken.mockReturnValue(
          Promise.resolve({
            accessToken: 'token',
            expires,
            lifeTime,
            scopes: ['youtrack'],
          }),
        );

        return expect(tokenValidator.validateTokenLocally()).to.be.rejectedWith(
          TokenValidator.TokenValidationError,
          "Token doesn't match required scopes",
        );
      });
    });

    describe('validateAgainstUser', () => {
      let authorizedFetch: MockInstance<HTTP['authorizedFetch']>;
      beforeEach(function beforeEach() {
        authorizedFetch = vi.spyOn(HTTP.prototype, 'authorizedFetch');
      });

      it('should resolve to access token when user is returned', async () => {
        const token = {accessToken: 'token'};
        authorizedFetch.mockReturnValue(Promise.resolve({login: 'user'}));
        // eslint-disable-next-line no-underscore-dangle
        const promise = tokenValidator._validateAgainstUser(token);
        expect(promise).to.be.fulfilled;
        await promise;
        expect(authorizedFetch).toHaveBeenCalledWith(Auth.API_PROFILE_PATH, 'token');
      });

      it('should reject with redirect if 401 response received', () => {
        const token = {accessToken: 'token'};
        authorizedFetch.mockReturnValue(
          Promise.reject({
            status: 401,
            response: {
              json() {
                return Promise.resolve({error: 'Problem'});
              },
            },
          }),
        );
        // eslint-disable-next-line no-underscore-dangle
        return expect(tokenValidator._validateAgainstUser(token)).to.be.rejectedWith(
          TokenValidator.TokenValidationError,
          'Problem',
        );
      });

      it('should reject with redirect if invalid_grant response received', () => {
        const token = {accessToken: 'token'};
        authorizedFetch.mockReturnValue(
          Promise.reject({
            response: {
              json() {
                return Promise.resolve({error: 'invalid_grant'});
              },
            },
          }),
        );
        // eslint-disable-next-line no-underscore-dangle
        return expect(tokenValidator._validateAgainstUser(token)).to.be.rejectedWith(
          TokenValidator.TokenValidationError,
          'invalid_grant',
        );
      });

      it('should reject with redirect if invalid_request response received', () => {
        const token = {accessToken: 'token'};
        authorizedFetch.mockReturnValue(
          Promise.reject({
            response: {
              json() {
                return Promise.resolve({error: 'invalid_request'});
              },
            },
          }),
        );
        // eslint-disable-next-line no-underscore-dangle
        return expect(tokenValidator._validateAgainstUser(token)).to.be.rejectedWith(
          TokenValidator.TokenValidationError,
          'invalid_request',
        );
      });

      it('should reject with redirect if 401 response without json received', () => {
        const token = {accessToken: 'token'};
        authorizedFetch.mockReturnValue(
          Promise.reject({
            status: 401,
            message: '403 Forbidden',
            response: {
              json() {
                return Promise.reject();
              },
            },
          }),
        );
        // eslint-disable-next-line no-underscore-dangle
        return expect(tokenValidator._validateAgainstUser(token)).to.be.rejectedWith(
          TokenValidator.TokenValidationError,
          '403 Forbidden',
        );
      });
    });

    describe('TokenValidationError', () => {
      it('should be cool', () => {
        expect(() => {
          throw new TokenValidator.TokenValidationError('message');
        }).to.throw(TokenValidator.TokenValidationError, 'message');
      });
    });
  });
});
