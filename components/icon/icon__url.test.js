import iconUrl from './icon__url';

describe('icon__url.test', function () {
  const baseUrl = 'http://example.com/';

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
