import ShortcutsNgHint from './shortcuts-hint-ng';
import Sniffr from 'sniffr';

import 'angular/angular';
import 'angular-mocks/angular-mocks';

describe('Shortcuts ng hint', function() {
  let shortcutKeySymbolFilter;

  beforeEach(angular.mock.module(ShortcutsNgHint));

  beforeEach(inject((_shortcutKeySymbolFilter_) => {
    shortcutKeySymbolFilter = _shortcutKeySymbolFilter_;
  }));

  describe('shortcut key symbol filter', function () {
    it('Should replace + with spaces on mac os', function() {
      this.sinon.stub(Sniffr.prototype, 'sniff', function() {
        this.os = {name: 'macos'}
      });
      shortcutKeySymbolFilter('somekey1+somekey2').should.be.equal('somekey1 somekey2');
    });

    it('Should replace + with spaces on windows', function() {
      this.sinon.stub(Sniffr.prototype, 'sniff', function() {
        this.os = {name: 'windows'}
      });
      shortcutKeySymbolFilter('somekey1+somekey2').should.be.equal('somekey1 + somekey2');
    });

    it('Should replace action keys with symbols on mac', function() {
      this.sinon.stub(Sniffr.prototype, 'sniff', function() {
        this.os = {name: 'macos'}
      });
      shortcutKeySymbolFilter('ctrl+alt+shift+enter+up+down+left+right+backspace')
        .should.be.equal('⌃ ⌥ ⇧ ⏎ ↑ ↓ ← → ⌫');
    });

    it('Should replace action keys with key names on windows', function() {
      this.sinon.stub(Sniffr.prototype, 'sniff', function() {
        this.os = {name: 'windows'}
      });
      shortcutKeySymbolFilter('ctrl+alt+shift+enter+up+down+left+right+backspace')
        .should.be.equal('Ctrl + Alt + Shift + ENTER + UP + DOWN + LEFT + RIGHT + BACKSPACE');
    });
  });
});
