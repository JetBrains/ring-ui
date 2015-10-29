describe('icon__url.test', function () {
  var iconUrl = require('./icon__url');
  var baseUrl = 'http://example.com/';

  beforeEach(function () {
    this.sinon.stub(iconUrl, 'getBaseUrl')
      .returns(baseUrl);
  });

  it('should resolve url fragment relative to the base url', function () {
    expect(iconUrl.resolve('#test')).to.be.equal('http://example.com/#test');
  });

  it('should correct resolve url if base url contain fragment', function () {
    iconUrl.getBaseUrl.returns(baseUrl + '#foo');

    expect(iconUrl.resolve('#zoo')).to.be.equal('http://example.com/#zoo');
  });
});
