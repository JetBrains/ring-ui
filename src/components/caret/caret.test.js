'use strict';
var Caret = require('./caret');

describe('Caret', function () {
  beforeEach(function () {
    this.target = document.createElement('textarea');
    this.target.value = 'this.target = document.createElement("textarea")';
    this.container = document.createElement('div');

    this.container.appendChild(this.target);
    document.body.appendChild(this.container);
  });

  afterEach(function () {
    document.body.removeChild(this.container);
    this.container = null;
    this.target = null;
  });

  it('Default position should be 0', function () {
    Caret.get(this.target).should.be.equal(0);
  });

  it('Set without arguments should fail', function () {
    should.not.exist(Caret.set(this.target));

    Caret.get(this.target).should.be.equal(0);
  });

  it('Set with argument should pass', function () {
    Caret.set(this.target, 15);

    Caret.get(this.target).should.be.equal(15);
  });
});
