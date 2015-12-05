import 'dom4';

import Sniffr from 'sniffr';
import urlUtils from '../url-utils/url-utils';

const sniffr = new Sniffr();
sniffr.sniff();

describe('urlUtils', function () {
  describe('fixUrl', function () {
    let baseTag;
    let baseUrl;

    beforeEach(function () {
      baseTag = document.createElement('base');
      baseTag.setAttribute('href', '/some/base/url/');
      document.head.prepend(baseTag);
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

  describe('resolveRelative', function () {
    const baseUrl = 'http://example.com/';

    beforeEach(function () {
      this.sinon.stub(urlUtils, 'getAbsoluteURL').returns(baseUrl);
    });

    it('should resolve url fragment relative to the base url when <base> tag is present in Firefox', function () {
      if (sniffr.browser.name !== 'firefox') {
        return;
      }

      this.sinon.stub(urlUtils, 'getBaseURI').returns('uri');

      urlUtils.resolveRelativeURL('#test').should.be.equal('http://example.com/#test');
    });


    it('should resolve url fragment relative to the base url when <base> tag is present not in Firefox', function () {
      if (sniffr.browser.name === 'firefox') {
        return;
      }

      this.sinon.stub(urlUtils, 'getBaseURI').returns('uri');

      urlUtils.resolveRelativeURL('#test').should.be.equal('#test');
    });

    it('should not resolve url fragment relative to the base url when there is no <base> tag', function () {
      this.sinon.stub(urlUtils, 'getBaseURI').returns();

      urlUtils.resolveRelativeURL('#test').should.be.equal('#test');
    });
  });

});
