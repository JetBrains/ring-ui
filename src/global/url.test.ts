import {encodeURL, fixUrl, joinBaseURLAndPath, getBaseURI, getOrigin, isDataURI, parseQueryString} from './url';

describe('Url', () => {
  describe('fixUrl', () => {
    let baseTag: Element;
    let baseUrl: string | undefined;

    beforeEach(() => {
      baseTag = document.createElement('base');
      baseTag.setAttribute('href', '/some/base/url/');
      document.head.prepend(baseTag);
      baseUrl = getBaseURI();
    });

    it('should fix relative url', () => {
      expect(fixUrl('relative/path')).to.be.equal(`${baseUrl}relative/path`);
    });

    it('should not fix absolute url', () => {
      expect(fixUrl('/absolute/path')).to.be.equal('/absolute/path');
    });

    it('should not fix absolute url with http', () => {
      expect(fixUrl('http://simple/path')).to.be.equal('http://simple/path');
    });

    it('should not fix absolute url with https', () => {
      expect(fixUrl('https://secure/path')).to.be.equal('https://secure/path');
    });

    it('should concat base url and path', () => {
      expect(joinBaseURLAndPath('http://base.com', '/test')).to.be.equal('http://base.com/test');
    });

    it('should not concat base url and path if base is empty', () => {
      expect(joinBaseURLAndPath(null, 'test')).to.be.equal('test');
    });

    it('should ignore base url if path is absolute url', () => {
      expect(joinBaseURLAndPath('http://base.com', 'http://absolute.com')).to.be.equal('http://absolute.com');
    });

    afterEach(() => {
      baseTag.remove();
    });
  });

  describe('getOrigin', () => {
    it('should return origin for absolute URIs', () => {
      expect(getOrigin('https://secure:433/path?q=p#hash')!).to.equal('https://secure:433');
    });

    it('should return undefined for relative URLs', () => {
      expect(getOrigin('/path:433/path?q=p#hash')).to.not.exist;
    });

    it('should return undefined for broken URLs', () => {
      expect(getOrigin('http:/')).to.not.exist;
    });
  });

  describe('parseQueryString', () => {
    it('should parse urls correctly', () => {
      const queryString = `access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&token_type=example&expires_in=3600`;

      expect(parseQueryString(queryString)).to.be.deep.equal({
        access_token: '2YotnFZFEjr1zCsicMWpAA',
        state: 'xyz',
        token_type: 'example',
        expires_in: '3600',
      });

    });

    it('should accept empty string', () => {
      expect(parseQueryString('')).to.be.deep.equal({});
    });

    it('should accept undefined', () => {
      expect(parseQueryString(undefined)).to.be.deep.equal({});
    });
  });

  describe('encodeURL', () => {
    it('should build URL correctly', () => {
      expect(
        encodeURL('http://localhost:8080/hub', {
          a: 'a',
          b: 'b',
        }),
      ).to.be.equal('http://localhost:8080/hub?a=a&b=b');
    });

    it('should accept relative URI', () => {
      expect(encodeURL('hub', {a: 'a', b: 'b'})).to.be.equal('hub?a=a&b=b');
    });

    it('should not encode null and undefined values', () => {
      expect(encodeURL('hub', {a: 'a', b: null, c: undefined, d: '', e: false})).to.be.equal('hub?a=a&d=&e=false');
    });

    it('should handle already existing query parameters', () => {
      expect(encodeURL('hub?c=c', {a: 'a', b: 'b'})).to.be.equal('hub?c=c&a=a&b=b');
    });

    it('should encode query parameters', () => {
      expect(encodeURL('hub', {'i am naughty': 'with%23some+problems'})).to.be.equal(
        'hub?i%20am%20naughty=with%2523some%2Bproblems',
      );
    });

    it('should not encode comma', () => {
      expect(encodeURL('hub', {test: 'with(some,allowed)'})).to.be.equal('hub?test=with(some,allowed)');
    });

    it('should not encode dollar', () => {
      expect(encodeURL('hub', {$top: '1'})).to.be.equal('hub?$top=1');
    });
  });

  describe('isDataURI', () => {
    it('should detect data uri', () => {
      expect(isDataURI('data:image/svg+xml;utf8,<svg></svg>')).to.be.true;
    });

    it('should not detect other uris', () => {
      expect(isDataURI('https://ring-ui')).to.be.false;
    });
  });
});
