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
    var parser = new AuthResponseParser();

    var location;
    beforeEach(function () {
      sinon.stub(AuthResponseParser.prototype, 'getLocation', function () {
        return location;
      });
      sinon.stub(AuthResponseParser.prototype, 'setHash');
    });

    afterEach(function () {
      AuthResponseParser.prototype.getLocation.restore();
      AuthResponseParser.prototype.setHash.restore();
    });

    it('should return correct response', function () {
      location = 'http://localhost:8080/hub#access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&token_type=example&expires_in=3600';
      parser.getAuthResponseFromURL().should.be.deep.equal({
        access_token: '2YotnFZFEjr1zCsicMWpAA',
        state: 'xyz',
        token_type: 'example',
        expires_in: '3600'
      });
      parser.setHash.should.have.been.calledWith('');
    });

    it('should return null for null location', function () {
      location = null;
      expect(parser.getAuthResponseFromURL()).to.be.null;
    });

    it('should return null for empty location', function () {
      location = '';
      expect(parser.getAuthResponseFromURL()).to.be.null;
    });

    it('should return null for empty hash', function () {
      location = 'http://localhost:8080/hub#';
      expect(parser.getAuthResponseFromURL()).to.be.null;
    });

    it('should return null for no hash', function () {
      location = 'http://localhost:8080/hub';
      expect(parser.getAuthResponseFromURL()).to.be.null;
    });

    it('should return correct for value with hashes', function () {
      location = 'http://localhost:8080/hub#access_token=#2YotnFZFEjr1zCsicMWpAA#';
      parser.getAuthResponseFromURL().should.be.deep.equal({access_token: '#2YotnFZFEjr1zCsicMWpAA#'});
      parser.setHash.should.have.been.calledWith('');
    });

    it('should throw error on error in auth response', function () {
      location = 'http://localhost:8080/hub#error=we+are+in+trouble';
      expect(parser.getAuthResponseFromURL.bind(parser)).to.throw(Error, 'we are in trouble');
      parser.setHash.should.have.been.calledWith('');
    });
  });
});
