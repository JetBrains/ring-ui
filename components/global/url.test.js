/* eslint-disable func-names */

import 'dom4';

import sniffer from '../global/sniffer';
import urlUtils from './url';

describe('Url Utils', () => {
  describe('fixUrl', () => {
    let baseTag;
    let baseUrl;

    beforeEach(() => {
      baseTag = document.createElement('base');
      baseTag.setAttribute('href', '/some/base/url/');
      document.head.prepend(baseTag);
      baseUrl = urlUtils.getBaseURI();
    });

    it('should fix relative url', () => {
      expect(urlUtils.fixUrl('relative/path')).to.be.equal(`${baseUrl}relative/path`);
    });

    it('should not fix absolute url', () => {
      expect(urlUtils.fixUrl('/absolute/path')).to.be.equal('/absolute/path');
    });

    it('should not fix absolute url with http', () => {
      expect(urlUtils.fixUrl('http://simple/path')).to.be.equal('http://simple/path');
    });

    it('should not fix absolute url with https', () => {
      expect(urlUtils.fixUrl('https://secure/path')).to.be.equal('https://secure/path');
    });

    afterEach(() => {
      baseTag.remove();
    });
  });

  describe('getOrigin', () => {
    it('should return origin for absolute URIs', () => {
      urlUtils.getOrigin('https://secure:433/path?q=p#hash').should.equal('https://secure:433');
    });

    it('should return undefined for relative URLs', () => {
      should.not.exist(urlUtils.getOrigin('/path:433/path?q=p#hash'));
    });

    it('should return undefined for broken URLs', () => {
      should.not.exist(urlUtils.getOrigin('http:/'));
    });
  });

  describe('resolveRelative', () => {
    const baseUrl = 'http://example.com/';
    const standardsCompliantRelativeSVG = sniffer.browser.name === 'firefox' ||
      sniffer.browser.name === 'chrome' && sniffer.browser.version[0] >= 49 ||
      sniffer.browser.name === 'edge';

    beforeEach(function () {
      this.sinon.stub(urlUtils, 'getAbsoluteURL').returns(baseUrl);
    });

    it('should resolve url fragment relative to the base url when <base> tag (standards-compliant)', function () {
      if (!standardsCompliantRelativeSVG) {
        return;
      }

      this.sinon.stub(urlUtils, 'getBaseURI').returns('uri');

      urlUtils.resolveRelativeURL('#test').should.be.equal('http://example.com/#test');
    });


    it('should resolve url fragment relative to the base url when <base> tag (not standards-compliant)', function () {
      if (standardsCompliantRelativeSVG) {
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
