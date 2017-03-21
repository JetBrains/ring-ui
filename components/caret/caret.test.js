/* eslint-disable func-names */

import Caret from './caret';

describe('Caret', () => {
  beforeEach(function () {
    this.target = document.createElement('div');
    this.target.innerHTML = 'this.target = document.createElement(textarea)';
    this.target.style.font = '12px/14px Arial';
    this.target.contentEditable = true;

    document.body.appendChild(this.target);

    this.caret = new Caret(this.target);
  });

  afterEach(function () {
    window.getSelection().removeAllRanges();
    document.body.removeChild(this.target);
    this.target = null;
  });

  describe('getPosition', () => {
    it('Default position should be 0', function () {
      window.getSelection().removeAllRanges();

      this.caret.getPosition().should.equal(0);
    });

    it('Get of selection should return -1', function () {
      const range = document.createRange();
      range.setStart(this.target, 0);
      range.setEnd(this.target, 1);
      window.getSelection().addRange(range);

      this.caret.getPosition().should.equal(-1);
    });

    it('Should get correct positions', function () {
      window.getSelection().collapse(this.target.firstChild, 10);

      this.caret.getPosition().should.equal(10);
    });

    it('Should focus on get by default', function () {
      this.caret.getPosition();

      this.target.should.equal(document.activeElement);
    });

    it('Shouldn\'t focus on get when prohibited', function () {
      this.caret.getPosition({avoidFocus: true});

      this.target.should.not.equal(document.activeElement);
    });
  });

  describe('setPosition', () => {
    it('Shouldn\'t change caret position if we don\'t position', function () {
      should.not.exist(this.caret.setPosition());

      this.caret.getPosition().should.equal(0);
    });

    // it('Should change caret position if we position', function () {
    //   this.caret.setPosition(15);
    //
    //   this.caret.getPosition().should.equal(15);
    // });
  });

  describe('getOffset', () => {
    it('Should get correct zero offset', function () {
      window.getSelection().collapse(this.target.firstChild, 0);

      this.caret.getOffset().should.equal(0);
    });

    it('Should get correct offset', function () {
      window.getSelection().collapse(this.target.firstChild, 10);

      // Test caret offset should be about 50px (browsers have some small differences)
      this.caret.getOffset().should.be.closeTo(50, 10);
    });
  });
});
