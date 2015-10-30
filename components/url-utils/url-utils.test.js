/**
 * @fileoverview Test cases for URL helpers.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

var $ = require('jquery');
var urlUtils = require('../url-utils/url-utils');

describe('urlUtils', function () {
  describe('fixUrl', function () {
    var baseTag;
    var baseUrl;

    beforeEach(function () {
      baseTag = $('<base href="/some/base/url/">');
      $(document.head).prepend(baseTag);
      baseUrl = urlUtils.getBaseURI();
    });

    it('should fix relative url', function () {
      expect(urlUtils.fixUrl('relative/path')).to.be.equal(baseUrl + 'relative/path');
    });

    it('should not fix absolute url', function () {
      expect(urlUtils.fixUrl('/absolute/path')).to.be.equal('/absolute/path');
    });

    it('should not fix absolute url with http', function () {
      expect(urlUtils.fixUrl('http://simple/path')).to.be.equal('http://simple/path');
    });

    it('should not fix absolute url with https', function () {
      expect(urlUtils.fixUrl('https://secure/path')).to.be.equal('https://secure/path');
    });

    afterEach(function () {
      baseTag.remove();
    });
  });

  describe('getOrigin', function () {
    it('should return origin for absolute URIs', function () {
      urlUtils.getOrigin('https://secure:433/path?q=p#hash').should.equal('https://secure:433');
    });

    it('should return undefined for relative URLs', function () {
      should.not.exist(urlUtils.getOrigin('/path:433/path?q=p#hash'));
    });

    it('should return undefined for broken URLs', function () {
      should.not.exist(urlUtils.getOrigin('http:/'));
    });
  });
});
