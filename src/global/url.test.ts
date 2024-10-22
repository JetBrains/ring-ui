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
      fixUrl('relative/path').should.be.equal(`${baseUrl}relative/path`);
    });

    it('should not fix absolute url', () => {
      fixUrl('/absolute/path').should.be.equal('/absolute/path');
    });

    it('should not fix absolute url with http', () => {
      fixUrl('http://simple/path').should.be.equal('http://simple/path');
    });

    it('should not fix absolute url with https', () => {
      fixUrl('https://secure/path').should.be.equal('https://secure/path');
    });

    it('should concat base url and path', () => {
      joinBaseURLAndPath('http://base.com', '/test').should.be.equal('http://base.com/test');
    });

    it('should not concat base url and path if base is empty', () => {
      joinBaseURLAndPath(null, 'test').should.be.equal('test');
    });

    it('should ignore base url if path is absolute url', () => {
      joinBaseURLAndPath('http://base.com', 'http://absolute.com').should.be.equal('http://absolute.com');
    });

    afterEach(() => {
      baseTag.remove();
    });
  });

  describe('getOrigin', () => {
    it('should return origin for absolute URIs', () => {
      getOrigin('https://secure:433/path?q=p#hash')!.should.equal('https://secure:433');
    });

    it('should return undefined for relative URLs', () => {
      should.not.exist(getOrigin('/path:433/path?q=p#hash'));
    });

    it('should return undefined for broken URLs', () => {
      should.not.exist(getOrigin('http:/'));
    });
  });

  describe('parseQueryString', () => {
    it('should parse urls correctly', () => {
      const queryString = `access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&token_type=example&expires_in=3600`;
      /* eslint-disable camelcase */
      parseQueryString(queryString).should.be.deep.equal({
        access_token: '2YotnFZFEjr1zCsicMWpAA',
        state: 'xyz',
        token_type: 'example',
        expires_in: '3600',
      });
      /* eslint-enable camelcase */
    });

    it('should accept empty string', () => {
      parseQueryString('').should.be.deep.equal({});
    });

    it('should accept undefined', () => {
      parseQueryString(undefined).should.be.deep.equal({});
    });
  });

  describe('encodeURL', () => {
    it('should build URL correctly', () => {
      encodeURL('http://localhost:8080/hub', {
        a: 'a',
        b: 'b',
      }).should.be.equal('http://localhost:8080/hub?a=a&b=b');
    });

    it('should accept relative URI', () => {
      encodeURL('hub', {a: 'a', b: 'b'}).should.be.equal('hub?a=a&b=b');
    });

    it('should not encode null and undefined values', () => {
      encodeURL('hub', {a: 'a', b: null, c: undefined, d: '', e: false}).should.be.equal('hub?a=a&d=&e=false');
    });

    it('should handle already existing query parameters', () => {
      encodeURL('hub?c=c', {a: 'a', b: 'b'}).should.be.equal('hub?c=c&a=a&b=b');
    });

    it('should encode query parameters', () => {
      encodeURL('hub', {'i am naughty': 'with%23some+problems'}).should.be.equal(
        'hub?i%20am%20naughty=with%2523some%2Bproblems',
      );
    });

    it('should not encode comma', () => {
      encodeURL('hub', {test: 'with(some,allowed)'}).should.be.equal('hub?test=with(some,allowed)');
    });

    it('should not encode dollar', () => {
      encodeURL('hub', {$top: '1'}).should.be.equal('hub?$top=1');
    });
  });

  describe('isDataURI', () => {
    it('should detect data uri', () => {
      isDataURI('data:image/svg+xml;utf8,<svg></svg>').should.be.true;
    });

    it('should not detect other uris', () => {
      isDataURI('https://ring-ui').should.be.false;
    });
  });
});
