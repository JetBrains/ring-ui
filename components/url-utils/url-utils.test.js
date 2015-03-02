/**
 * @fileoverview Test cases for URL helpers.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

var $ = require('jquery');
var UrlUtils = require('url-utils/url-utils');

describe('_fixUrl', function() {
  var baseTag;
  var baseUrl;

  beforeEach(function () {
    baseTag = $('<base href="/some/base/url/">');
    $(document.head).prepend(baseTag);
    baseUrl = UrlUtils.baseURI();
  });

  it('should fix relative url', function() {
    expect(UrlUtils.fixUrl('relative/path')).to.be.equal(baseUrl + 'relative/path');
  });

  it('should not fix absolute url', function() {
    expect(UrlUtils.fixUrl('/absolute/path')).to.be.equal('/absolute/path');
  });

  it('should not fix absolute url with http', function() {
    expect(UrlUtils.fixUrl('http://simple/path')).to.be.equal('http://simple/path');
  });

  it('should not fix absolute url with https', function() {
    expect(UrlUtils.fixUrl('https://secure/path')).to.be.equal('https://secure/path');
  });

  afterEach(function() {
    baseTag.remove();
  });
});
