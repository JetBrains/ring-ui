/* eslint-disable @typescript-eslint/no-magic-numbers */
import type {Stub} from '../../test-helpers/globals.d';

import HTTP from '../http/http';
import LocalStorage from '../storage/storage__local';

import Auth from './auth';
import AuthStorage from './storage';
import TokenValidator from './token-validator';

describe('Auth', () => {
  describe('TokenValidator', () => {
    const storage = new AuthStorage({
      storage: LocalStorage
    });
    const http = new HTTP();
    const getUser = (token: string) => http.authorizedFetch(Auth.API_PROFILE_PATH, token);
    const tokenValidator = new TokenValidator({
      scope: ['0-0-0-0-0', 'youtrack'],
      optionalScopes: ['youtrack']
    }, getUser, storage);
    const lifeTime = 60 * 60;
    const expires = TokenValidator._epoch() + lifeTime;

    describe('getValidatedToken', () => {
      let getToken: Stub<AuthStorage['getToken']>;
      beforeEach(function beforeEach() {
        getToken = sandbox.stub(AuthStorage.prototype, 'getToken');
      });

      it('should resolve access token when it is valid', () => {

        getToken.returns(Promise.resolve({
          accessToken: 'token',
          expires,
          lifeTime,
          scopes: ['0-0-0-0-0', 'youtrack']
        }));

        return tokenValidator.validateTokenLocally().
          should.eventually.be.equal('token');
      });

      it('should resolve access token when token is given for all required scopes', () => {
        getToken.returns(Promise.resolve({
          accessToken: 'token',
          expires,
          lifeTime,
          scopes: ['0-0-0-0-0']
        }));

        return tokenValidator.validateTokenLocally().
          should.eventually.be.equal('token');
      });

      it('should reject if accessToken is empty', () => {
        // @ts-expect-error testing a wrong usage
        getToken.returns(Promise.resolve({
          accessToken: null,
          expires,
          lifeTime,
          scopes: ['0-0-0-0-0']
        }));

        return tokenValidator.validateTokenLocally().
          should.be.rejectedWith(TokenValidator.TokenValidationError, 'Token not found');
      });

      it('should reject if there is no token stored', () => {
        getToken.returns(Promise.resolve(null));
        return tokenValidator.validateTokenLocally().
          should.be.rejectedWith(TokenValidator.TokenValidationError, 'Token not found');
      });

      it('should reject if token is about to be expired (<1/6 lifeTime left)', () => {
        getToken.returns(Promise.resolve({
          accessToken: 'token',
          expires: TokenValidator._epoch() + (lifeTime / 6) - 1,
          lifeTime,
          scopes: ['0-0-0-0-0']
        }));
        return tokenValidator.validateTokenLocally().
          should.be.rejectedWith(TokenValidator.TokenValidationError, 'Token expired');
      });

      it('should reject if short-life token is about to be expired (<1/6 lifeTime left)', () => {
        const minimalLifeTime = 60 * 5;
        getToken.returns(Promise.resolve({
          accessToken: 'token',
          expires: TokenValidator._epoch() + (minimalLifeTime / 6) - 1,
          lifeTime: minimalLifeTime,
          scopes: ['0-0-0-0-0']
        }));
        return tokenValidator.validateTokenLocally().
          should.be.rejectedWith(TokenValidator.TokenValidationError, 'Token expired');
      });

      it('should reject if token is about to be expired but lifeTime is not set and default time used', () => {
        getToken.returns(Promise.resolve({
          accessToken: 'token',
          expires: TokenValidator._epoch() + 5 * 60,
          scopes: ['0-0-0-0-0']
        }));
        return tokenValidator.validateTokenLocally().
          should.be.rejectedWith(TokenValidator.TokenValidationError, 'Token expired');
      });

      it('should reject if token scopes don\'t match required scopes', () => {
        getToken.returns(Promise.resolve({
          accessToken: 'token',
          expires,
          lifeTime,
          scopes: ['youtrack']
        }));

        return tokenValidator.validateTokenLocally().
          should.
          be.
          rejectedWith(TokenValidator.TokenValidationError, 'Token doesn\'t match required scopes');
      });
    });

    describe('validateAgainstUser', () => {
      let authorizedFetch: Stub<HTTP['authorizedFetch']>;
      beforeEach(function beforeEach() {
        authorizedFetch = sandbox.stub(HTTP.prototype, 'authorizedFetch');
      });

      it('should resolve to access token when user is returned', async () => {
        const token = {accessToken: 'token'};
        authorizedFetch.returns(Promise.resolve({login: 'user'}));
        const promise = tokenValidator._validateAgainstUser(token);
        promise.should.be.fulfilled;
        await promise;
        authorizedFetch.should.have.been.calledWith(Auth.API_PROFILE_PATH, 'token');
      });

      it('should reject with redirect if 401 response received', () => {
        const token = {accessToken: 'token'};
        authorizedFetch.returns(Promise.reject({
          status: 401,
          response: {
            json() {
              return Promise.resolve({error: 'Problem'});
            }
          }
        }));
        return tokenValidator._validateAgainstUser(token).
          should.be.rejectedWith(TokenValidator.TokenValidationError, 'Problem');
      });

      it('should reject with redirect if invalid_grant response received', () => {
        const token = {accessToken: 'token'};
        authorizedFetch.returns(Promise.reject({
          response: {
            json() {
              return Promise.resolve({error: 'invalid_grant'});
            }
          }
        }));
        return tokenValidator._validateAgainstUser(token).
          should.be.rejectedWith(TokenValidator.TokenValidationError, 'invalid_grant');
      });

      it('should reject with redirect if invalid_request response received', () => {
        const token = {accessToken: 'token'};
        authorizedFetch.returns(Promise.reject({
          response: {
            json() {
              return Promise.resolve({error: 'invalid_request'});
            }
          }
        }));
        return tokenValidator._validateAgainstUser(token).
          should.be.rejectedWith(TokenValidator.TokenValidationError, 'invalid_request');
      });

      it('should reject with redirect if 401 response without json received', () => {
        const token = {accessToken: 'token'};
        authorizedFetch.returns(Promise.reject({
          status: 401,
          message: '403 Forbidden',
          response: {
            json() {
              return Promise.reject();
            }
          }
        }));
        return tokenValidator._validateAgainstUser(token).
          should.be.rejectedWith(TokenValidator.TokenValidationError, '403 Forbidden');
      });
    });


    describe('TokenValidationError', () => {
      it('should be cool', () => {
        (() => {
          throw new TokenValidator.TokenValidationError('message');
        }).should.throw(TokenValidator.TokenValidationError, 'message');
      });
    });
  });
});
