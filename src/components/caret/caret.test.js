'use strict';
var Caret = require('./caret');

describe('Caret', function () {
  function createRange (start, end) {
    var range = document.createRange();
    range.setStart(this.target, start);
    range.setEnd(this.target, end);
    window.getSelection().addRange(range);
  }

  beforeEach(function () {
    this.target = document.createElement('div');
    this.target.innerHTML = 'this.target = document.createElement(<b>textarea</b>)';
    this.target.contentEditable = true;
    this.container = document.createElement('div');

    this.container.appendChild(this.target);
    document.body.appendChild(this.container);

    this.caret = new Caret(this.target);
  });

  afterEach(function () {
    document.body.removeChild(this.container);
    window.getSelection().removeAllRanges();
    this.container = null;
    this.target = null;
  });

  it('Default position should be 0', function () {
    this.caret.getPosition().should.equal(0);
  });

  it('Get of selection should return -1', function () {
    createRange.call(this, 0, 1);

    this.caret.getPosition().should.equal(-1);
  });

  it('Should get correct positions', function () {
    createRange.call(this, 0, 0);
    window.getSelection().collapse(this.target.firstChild, 10);

    this.caret.getPosition().should.equal(10);
  });

  it('Shouldn\'t change caret position if we don\'t position', function () {
    should.not.exist(this.caret.setPosition());

    this.caret.getPosition().should.equal(0);
  });

  it('Should change caret position if we position', function () {
    this.caret.setPosition(15);

    this.caret.getPosition().should.equal(15);
  });

  it('Should get correct zero', function () {
    createRange.call(this, 0, 0);
    window.getSelection().collapse(this.target.firstChild, 0);

    this.caret.getOffset().should.equal(0);
  });

  it('Should get correct offset', function () {
    createRange.call(this, 0, 1);
    window.getSelection().collapse(this.target.firstChild, 10);

    this.caret.getOffset().should.equal(57);
  });
});
