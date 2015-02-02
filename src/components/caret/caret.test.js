'use strict';
var Caret = require('./caret');

describe('Caret', function () {
  beforeEach(function () {
    this.target = document.createElement('div');
    this.target.innerHTML = 'this.target = document.createElement(textarea)';
    this.target.style = 'position: absolute; left: 0; top: 0;';
    this.target.contentEditable = true;

    document.body.appendChild(this.target);

    var range = document.createRange();
    range.selectNodeContents(this.target);
    window.getSelection().addRange(range);

    this.caret = new Caret(this.target);
  });

  afterEach(function () {
    window.getSelection().removeAllRanges();
    document.body.removeChild(this.target);
    this.target = null;
  });

  describe('getPosition', function () {
    it('Default position should be 0', function () {
      window.getSelection().removeAllRanges();

      this.caret.getPosition().should.equal(0);
    });

    it('Get of selection should return -1', function () {
      var range = document.createRange();
      range.setStart(this.target, 0);
      range.setEnd(this.target, 1);
      window.getSelection().addRange(range);

      this.caret.getPosition().should.equal(-1);
    });

    it('Should get correct positions', function () {
      window.getSelection().collapse(this.target.firstChild, 10);

      this.caret.getPosition().should.equal(10);
    });
  });

  describe('setPosition', function () {
    it('Shouldn\'t change caret position if we don\'t position', function () {
      should.not.exist(this.caret.setPosition());

      this.caret.getPosition().should.equal(0);
    });

    it('Should change caret position if we position', function () {
      this.caret.setPosition(15);

      this.caret.getPosition().should.equal(15);
    });
  });

  describe('getOffset', function () {
    it('Should get correct zero offset', function () {
      window.getSelection().collapse(this.target.firstChild, 0);

      this.caret.getOffset().should.equal(0);
    });

    it('Should get correct offset', function () {
      window.getSelection().collapse(this.target.firstChild, 10);

      // Test caret offset should be about 60px (PhantomJS has small differences)
      (Math.ceil(this.caret.getOffset() / 10) * 10).should.equal(60);
    });
  });
});
