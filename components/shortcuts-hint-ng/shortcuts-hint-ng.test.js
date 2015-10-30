import ShortcutsNgHint from './shortcuts-hint-ng';
import Sniffr from 'sniffr';

import 'angular-mocks';

describe('Shortcuts ng hint', function () {
  /* global angular:false */
  beforeEach(angular.mock.module(ShortcutsNgHint));

  describe('shortcut key symbol filter', function () {
    let shortcutKeySymbolFilter;

    /* global inject */
    beforeEach(inject(_shortcutKeySymbolFilter_ => {
      shortcutKeySymbolFilter = _shortcutKeySymbolFilter_;
    }));

    it('Should replace + with spaces on mac os', function () {
      this.sinon.stub(Sniffr.prototype, 'sniff', function () {
        this.os = {name: 'macos'};
      });
      shortcutKeySymbolFilter('somekey1+somekey2').should.be.equal('somekey1 somekey2');
    });

    it('Should replace + with spaces on windows', function () {
      this.sinon.stub(Sniffr.prototype, 'sniff', function () {
        this.os = {name: 'windows'};
      });
      shortcutKeySymbolFilter('somekey1+somekey2').should.be.equal('somekey1 + somekey2');
    });

    it('Should replace action keys with symbols on mac', function () {
      this.sinon.stub(Sniffr.prototype, 'sniff', function () {
        this.os = {name: 'macos'};
      });
      shortcutKeySymbolFilter('ctrl+alt+shift+enter+up+down+left+right+backspace')
        .should.be.equal('⌃ ⌥ ⇧ ⏎ ↑ ↓ ← → ⌫');
    });

    it('Should replace action keys with key names on windows', function () {
      this.sinon.stub(Sniffr.prototype, 'sniff', function () {
        this.os = {name: 'windows'};
      });
      shortcutKeySymbolFilter('ctrl+alt+shift+enter+up+down+left+right+backspace')
        .should.be.equal('Ctrl + Alt + Shift + ENTER + UP + DOWN + LEFT + RIGHT + BACKSPACE');
    });
  });

  describe('shortcut search filter', function () {
    let shortcutSearchFilter;
    let fakeShortcuts;

    beforeEach(inject(_shortcutSearchFilter_ => {
      shortcutSearchFilter = _shortcutSearchFilter_;

      fakeShortcuts = [
        {key: 'shift+left+up', title: 'combination first'},
        {key: 'ctrl+enter', title: 'some second'},
        {key: 'meta+alt+down', title: 'combination third'}
      ];
    }));

    it('Should not filter if query is empty', function () {
      const filtered = shortcutSearchFilter(fakeShortcuts, undefined);

      filtered.should.be.deep.equal(fakeShortcuts);
    });

    it('Should search by shortcut title', function () {
      const filtered = shortcutSearchFilter(fakeShortcuts, 'second');

      filtered.length.should.be.equal(1);
      filtered[0].should.be.equal(fakeShortcuts[1]);
    });

    it('Should search by shortcut key', function () {
      const filtered = shortcutSearchFilter(fakeShortcuts, 'down');

      filtered.length.should.be.equal(1);
      filtered[0].should.be.equal(fakeShortcuts[2]);
    });

    it('Should search by shortcut symbol on mac', function () {
      this.sinon.stub(Sniffr.prototype, 'sniff', function () {
        this.os = {name: 'macos'};
      });
      const filtered = shortcutSearchFilter(fakeShortcuts, '⌥');

      filtered.length.should.be.equal(1);
      filtered[0].should.be.equal(fakeShortcuts[2]);
    });

    it('Should find multiple results', function () {
      const filtered = shortcutSearchFilter(fakeShortcuts, 'combination');

      filtered.length.should.be.equal(2);
    });

    it('Should support multiple keys', function () {
      const filtered = shortcutSearchFilter([
        {key: ['shift+left+up', 'shift+left+up'], title: 'combination first'}
      ], 'combination');

      filtered.length.should.be.equal(1);
    });
  });
});
