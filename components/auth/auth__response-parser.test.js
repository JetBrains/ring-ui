/* eslint-disable google-camelcase/google-camelcase */
describe('Auth', function () {
  describe('AuthResponseParser', function () {
    describe('parseQueryString', function () {
      var AuthResponseParser = require('./auth__response-parser');

      it('should parse urls correctly', function () {
        var queryString = 'access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&token_type=example&expires_in=3600';
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
      var AuthResponseParser = require('./auth__response-parser');

      var location;
      beforeEach(function () {
        sinon.stub(AuthResponseParser.prototype, 'getLocation', function () {
          return location;
        });
      });

      afterEach(function () {
        AuthResponseParser.prototype.getLocation.restore();
      });

      it('should return correct response', function () {
        location = 'http://localhost:8080/hub#access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&token_type=example&expires_in=3600';

        var parser = new AuthResponseParser();
        parser.getAuthResponseFromURL().should.be.deep.equal({
          access_token: '2YotnFZFEjr1zCsicMWpAA',
          state: 'xyz',
          token_type: 'example',
          expires_in: '3600'
        });
      });

      it('should return null for null location', function () {
        location = null;
        var parser = new AuthResponseParser();
        expect(parser.getAuthResponseFromURL()).to.be.null;
      });

      it('should return null for empty location', function () {
        location = '';
        var parser = new AuthResponseParser();
        expect(parser.getAuthResponseFromURL()).to.be.null;
      });

      it('should return null for empty hash', function () {
        location = 'http://localhost:8080/hub#';
        var parser = new AuthResponseParser();
        expect(parser.getAuthResponseFromURL()).to.be.null;
      });

      it('should return null for no hash', function () {
        location = 'http://localhost:8080/hub';
        var parser = new AuthResponseParser();
        expect(parser.getAuthResponseFromURL()).to.be.null;
      });

      it('should return correct for value with hashes', function () {
        location = 'http://localhost:8080/hub#access_token=#2YotnFZFEjr1zCsicMWpAA#';
        var parser = new AuthResponseParser();
        parser.getAuthResponseFromURL().should.be.deep.equal({access_token: '#2YotnFZFEjr1zCsicMWpAA#'});
      });

      it('should throw error on error in auth response', function () {
        location = 'http://localhost:8080/hub#error=we+are+in+trouble';
        var parser = new AuthResponseParser();
        expect(parser.getAuthResponseFromURL.bind(parser)).to.throw(Error, 'we are in trouble');
      });
    });
  });
});
