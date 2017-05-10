/* eslint-disable camelcase */
import AuthResponseParser from './response-parser';

describe('Auth', () => {
  describe('AuthResponseParser', () => {
    describe('getAuthResponseFromURL', () => {
      let location;
      beforeEach(function () {
        this.sinon.stub(AuthResponseParser.prototype, 'getLocation').callsFake(() => location);
      });

      it('should return correct response', () => {
        location = 'http://localhost:8080/hub#access_token=2YotnFZFEjr1zCsicMWpAA' +
          '&state=xyz&token_type=example&expires_in=3600';

        const parser = new AuthResponseParser();
        parser.getAuthResponseFromURL().should.be.deep.equal({
          access_token: '2YotnFZFEjr1zCsicMWpAA',
          state: 'xyz',
          token_type: 'example',
          expires_in: '3600'
        });
      });

      it('should return null for null location', () => {
        location = null;
        const parser = new AuthResponseParser();
        expect(parser.getAuthResponseFromURL()).to.be.null;
      });

      it('should return null for empty location', () => {
        location = '';
        const parser = new AuthResponseParser();
        expect(parser.getAuthResponseFromURL()).to.be.null;
      });

      it('should return null for empty hash', () => {
        location = 'http://localhost:8080/hub#';
        const parser = new AuthResponseParser();
        expect(parser.getAuthResponseFromURL()).to.be.null;
      });

      it('should return null for no hash', () => {
        location = 'http://localhost:8080/hub';
        const parser = new AuthResponseParser();
        expect(parser.getAuthResponseFromURL()).to.be.null;
      });

      it('should return correct for value with hashes', () => {
        location = 'http://localhost:8080/hub#access_token=#2YotnFZFEjr1zCsicMWpAA#';
        const parser = new AuthResponseParser();
        parser.getAuthResponseFromURL().should.be.deep.
          equal({access_token: '#2YotnFZFEjr1zCsicMWpAA#'});
      });

      it('should throw error on error in auth response', () => {
        location = 'http://localhost:8080/hub#error=we+are+in+trouble';
        const parser = new AuthResponseParser();
        parser.getAuthResponseFromURL.bind(parser).should.throw(AuthResponseParser.AuthError);
      });

      it('should throw error with fields from request', () => {
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
