/**
 * @fileoverview
 * @author igor.alexeenko (Igor Alekseyenko)
 */

import ClassName from './class-name';

describe('ClassName', function () {
  const BASE_CLASS = 'base-class';
  let className;

  beforeEach(function () {
    className = new ClassName(BASE_CLASS);
  });

  it('should create BEM-name generator', function () {
    className.should.be.ok;
    className.baseName.should.equal(BASE_CLASS);
  });

  it('getClassName() without arguments should return base class as is', function () {
    className.getClassName().should.equal(BASE_CLASS);
  });

  it('getClassName() with first argument should return BEM-name of element', function () {
    className.getClassName('element').should.equal(BASE_CLASS + '__element');
  });

  it('getClassName() with second argument should return BEM-modificator of element', function () {
    className.getClassName(undefined, 'modifier').should.equal(BASE_CLASS + '_modifier');
    className.getClassName(null, 'modifier').should.equal(BASE_CLASS + '_modifier');
    className.getClassName('', 'modifier').should.equal(BASE_CLASS + '_modifier');
    className.getClassName(false, 'modifier').should.equal(BASE_CLASS + '_modifier');
  });

  it('getClassName() with both arguments should return valid BEM-name', function () {
    className.getClassName('element', 'modifier').should.equal(BASE_CLASS + '__element_modifier');
  });

  describe('shortcuts', function () {
    it('getElement() should return element', function () {
      className.getElement('element').should.equal(BASE_CLASS + '__element');
    });

    it('getModifier() should return modifier', function () {
      className.getModifier('modifier').should.equal(BASE_CLASS + '_modifier');
    });
  });
});
