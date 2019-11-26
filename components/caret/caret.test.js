/* eslint-disable no-magic-numbers */

import Caret from './caret';

describe('Caret', () => {
  let target;
  let caret;
  beforeEach(() => {
    target = document.createElement('div');
    target.innerHTML = 'target = document.createElement(textarea)';
    target.style.font = '12px/14px Arial';
    target.contentEditable = true;

    document.body.appendChild(target);

    caret = new Caret(target);
  });

  afterEach(() => {
    window.getSelection().removeAllRanges();
    // document.body.removeChild(target);
    target = null;
  });

  describe('getPosition', () => {
    it('Default position should be 0', () => {
      window.getSelection().removeAllRanges();

      caret.getPosition().should.equal(0);
    });

    it('Should get correct positions', () => {
      window.getSelection().collapse(target.firstChild, 10);

      caret.getPosition().should.equal(10);
    });

    it('Should focus on get by default', () => {
      caret.getPosition();

      target.should.equal(document.activeElement);
    });
  });

  describe('setPosition', () => {
    it('Shouldn\'t change caret position if we don\'t position', () => {
      should.not.exist(caret.setPosition());

      caret.getPosition().should.equal(0);
    });

    it('Should change caret position if we position', () => {
      caret.setPosition(15);

      caret.getPosition().should.equal(15);
    });
  });

  describe('getOffset', () => {
    it('Should get correct zero offset', () => {
      window.getSelection().collapse(target.firstChild, 0);

      caret.getOffset().should.equal(0);
    });

    it('Should get correct offset', () => {
      window.getSelection().collapse(target.firstChild, 10);

      // Test caret offset should be about 50px (browsers have some small differences)
      caret.getOffset().should.be.closeTo(50, 15);
    });
  });
});
