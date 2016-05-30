/* eslint-disable func-names */
/* eslint-disable angular/no-angular-mock */

import 'angular';
import 'angular-mocks';

import ShortcutsNgHint from './shortcuts-hint-ng';
import sniffer from '../sniffer/sniffer';

describe('Shortcuts ng hint', () => {
  /* global angular:false */
  beforeEach(angular.mock.module(ShortcutsNgHint));

  describe('shortcut key symbol filter', () => {
    let shortcutKeySymbolFilter;

    /* global inject */
    beforeEach(inject(_shortcutKeySymbolFilter_ => {
      shortcutKeySymbolFilter = _shortcutKeySymbolFilter_;
    }));

    it('Should replace + with spaces on mac os', function () {
      this.sinon.stub(sniffer, 'os', {name: 'macos'});
      shortcutKeySymbolFilter('S1+S2').should.be.equal('S1 S2');
    });

    it('Should replace + with spaces on windows', function () {
      this.sinon.stub(sniffer, 'os', {name: 'windows'});
      shortcutKeySymbolFilter('S1+S2').should.be.equal('S1 + S2');
    });

    it('Should capitalize key if is not in key mapping', function () {
      this.sinon.stub(sniffer, 'os', {name: 'macos'});
      shortcutKeySymbolFilter('f2+e').should.be.equal('F2 E');
    });

    it('Should replace action keys with symbols on mac', function () {
      this.sinon.stub(sniffer, 'os', {name: 'macos'});
      shortcutKeySymbolFilter('ctrl+alt+shift+enter+up+down+left+right+backspace').
        should.be.equal('⌃ ⌥ ⇧ ⏎ ↑ ↓ ← → ⌫');
    });

    it('Should replace action keys with key names on windows', function () {
      this.sinon.stub(sniffer, 'os', {name: 'windows'});
      shortcutKeySymbolFilter('ctrl+alt+shift+enter+up+down+left+right+backspace+f4').
        should.be.equal('Ctrl + Alt + Shift + Enter + Up + Down + Left + Right + Backspace + F4');
    });
  });

  describe('shortcut search filter', () => {
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

    it('Should not filter if query is empty', () => {
      const filtered = shortcutSearchFilter(fakeShortcuts, undefined);

      filtered.should.be.deep.equal(fakeShortcuts);
    });

    it('Should search by shortcut title', () => {
      const filtered = shortcutSearchFilter(fakeShortcuts, 'second');

      filtered.length.should.be.equal(1);
      filtered[0].should.be.equal(fakeShortcuts[1]);
    });

    it('Should search by shortcut key', () => {
      const filtered = shortcutSearchFilter(fakeShortcuts, 'down');

      filtered.length.should.be.equal(1);
      filtered[0].should.be.equal(fakeShortcuts[2]);
    });

    it('Should search by shortcut symbol on mac', function () {
      this.sinon.stub(sniffer, 'os', {name: 'macos'});
      const filtered = shortcutSearchFilter(fakeShortcuts, '⌥');

      filtered.length.should.be.equal(1);
      filtered[0].should.be.equal(fakeShortcuts[2]);
    });

    it('Should find multiple results', () => {
      const filtered = shortcutSearchFilter(fakeShortcuts, 'combination');

      filtered.length.should.be.equal(2);
    });

    it('Should support multiple keys', () => {
      const filtered = shortcutSearchFilter([
        {key: ['shift+left+up', 'shift+left+up'], title: 'combination first'}
      ], 'combination');

      filtered.length.should.be.equal(1);
    });
  });
});
