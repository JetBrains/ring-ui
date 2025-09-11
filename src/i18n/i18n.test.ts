import {type MockInstance} from 'vitest';

import defaultMessages from './messages.json';
import {translate, getTranslationsWithFallback, getTranslations, setTranslations} from './i18n';

describe('i18n singleton', () => {
  let consoleWarnStub: MockInstance;
  beforeEach(() => {
    consoleWarnStub = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnStub.mockRestore();
    setTranslations(defaultMessages);
  });

  it('should return the value for an existing key', () => {
    setTranslations({login: 'bar'});
    const result = translate('login');
    expect(result).to.equal('bar');
  });

  it('should log a warning for a missing key', () => {
    setTranslations({login: 'bar'});
    translate('filterItems');
    expect(consoleWarnStub).toHaveBeenCalledOnce();
    expect(consoleWarnStub.mock.calls[0][0]).to.equal('Missing localisation for key "filterItems"');
  });

  it('should log a warning only once for a missing key', () => {
    setTranslations({login: 'bar'});
    translate('decline');
    translate('decline');
    expect(consoleWarnStub).toHaveBeenCalledOnce();
  });

  it('should return a merged object with the translations and default messages', () => {
    setTranslations({logout: 'bar'});
    const result = getTranslationsWithFallback();
    expect(result.login).to.equal(defaultMessages.login);
    expect(result.logout).to.equal('bar');
  });

  it('should return the current translations object', () => {
    setTranslations({login: 'bar'});
    const result = getTranslations();
    expect(result).to.deep.equal({login: 'bar'});
  });
});
