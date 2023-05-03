import sinon from 'sinon';

import defaultMessages from './messages.json';
import {translate, getTranslationsWithFallback, getTranslations, setTranslations} from './i18n';

describe('i18n singleton', () => {
  let consoleWarnStub: sinon.SinonStub;
  beforeEach(() => {
    sandbox.stub(console, 'warn');
    // eslint-disable-next-line no-console
    consoleWarnStub = console.warn as sinon.SinonStub;
  });

  afterEach(() => {
    consoleWarnStub.restore();
    setTranslations(defaultMessages);
  });

  it('should return the value for an existing key', () => {
    setTranslations({login: 'bar'});
    const result = translate('login');
    result.should.equal('bar');
  });

  it('should log a warning for a missing key', () => {
    setTranslations({login: 'bar'});
    translate('filterItems');
    consoleWarnStub.calledOnce.should.be.true;
    consoleWarnStub.firstCall.args[0].should.equal('Missing localisation for key "filterItems"');
  });

  it('should log a warning only once for a missing key', () => {
    setTranslations({login: 'bar'});
    translate('decline');
    translate('decline');
    consoleWarnStub.calledOnce.should.be.true;
  });

  it('should return a merged object with the translations and default messages', () => {
    setTranslations({logout: 'bar'});
    const result = getTranslationsWithFallback();
    result.login.should.equal(defaultMessages.login);
    result.logout.should.equal('bar');
  });

  it('should return the current translations object', () => {
    setTranslations({login: 'bar'});
    const result = getTranslations();
    result.should.deep.equal({login: 'bar'});
  });
});
