/* eslint-disable camelcase */
import AuthResponseParser from './auth__response-parser';

describe('Auth', function () {
  describe('AuthResponseParser', function () {
    describe('parseQueryString', function () {
      it('should parse urls correctly', function () {
        const queryString = 'access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&token_type=example&expires_in=3600';
        AuthResponseParser.parseQueryString(queryString).should.be.deep.equal({
          access_token: '2YotnFZFEjr1zCsicMWpAA',
          state: 'xyz',
          token_type: 'example',
          expires_in: '3600'
        });
      });

      it('should accept empty string', function () {
        AuthResponseParser.parseQueryString('').should.be.deep.equal({});
      });

      it('should accept undefined', function () {
        AuthResponseParser.parseQueryString(undefined).should.be.deep.equal({});
      });
    });

    describe('getAuthResponseFromURL', function () {
      let location;
      beforeEach(function () {
        this.sinon.stub(AuthResponseParser.prototype, 'getLocation', function () {
          return location;
        });
      });

      it('should return correct response', function () {
        location = 'http://localhost:8080/hub#access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&token_type=example&expires_in=3600';

        const parser = new AuthResponseParser();
        parser.getAuthResponseFromURL().should.be.deep.equal({
          access_token: '2YotnFZFEjr1zCsicMWpAA',
          state: 'xyz',
          token_type: 'example',
          expires_in: '3600'
        });
      });

      it('should return null for null location', function () {
        location = null;
        const parser = new AuthResponseParser();
        expect(parser.getAuthResponseFromURL()).to.be.null;
      });

      it('should return null for empty location', function () {
        location = '';
        const parser = new AuthResponseParser();
        expect(parser.getAuthResponseFromURL()).to.be.null;
      });

      it('should return null for empty hash', function () {
        location = 'http://localhost:8080/hub#';
        const parser = new AuthResponseParser();
        expect(parser.getAuthResponseFromURL()).to.be.null;
      });

      it('should return null for no hash', function () {
        location = 'http://localhost:8080/hub';
        const parser = new AuthResponseParser();
        expect(parser.getAuthResponseFromURL()).to.be.null;
      });

      it('should return correct for value with hashes', function () {
        location = 'http://localhost:8080/hub#access_token=#2YotnFZFEjr1zCsicMWpAA#';
        const parser = new AuthResponseParser();
        parser.getAuthResponseFromURL().should.be.deep.equal({access_token: '#2YotnFZFEjr1zCsicMWpAA#'});
      });

      it('should throw error on error in auth response', function () {
        location = 'http://localhost:8080/hub#error=we+are+in+trouble';
        const parser = new AuthResponseParser();
        parser.getAuthResponseFromURL.bind(parser).should.throw(AuthResponseParser.AuthError, 'we are in trouble');
      });

      it('should throw error with fields from request', function () {
        location = 'http://localhost:8080/hub#error=access_denied&' +
        'error_uri=http://error&error_description=Logged+in+user+is+banned&state=unique';
        const parser = new AuthResponseParser();

        try {
          parser.getAuthResponseFromURL();
        } catch (e) {
          e.should.have.property('message', 'Logged in user is banned');
          e.should.have.property('code', 'access_denied');
          e.should.have.property('stateId', 'unique');
          e.should.have.property('uri', 'http://error');
        }
      });
    });
  });
});
