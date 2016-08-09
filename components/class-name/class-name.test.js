/**
 * @fileoverview
 * @author igor.alexeenko (Igor Alekseyenko)
 */

import ClassName from './class-name';

describe('Classname', () => {
  const BASE_CLASS = 'base-class';
  let className;

  beforeEach(() => {
    className = new ClassName(BASE_CLASS);
  });

  it('should create BEM-name generator', () => {
    className.should.be.ok;
    className.baseName.should.equal(BASE_CLASS);
  });

  it('getClassName() without arguments should return base class as is', () => {
    className.getClassName().should.equal(BASE_CLASS);
  });

  it('getClassName() with first argument should return BEM-name of element', () => {
    className.getClassName('element').should.equal(`${BASE_CLASS}__element`);
  });

  it('getClassName() with second argument should return BEM-modificator of element', () => {
    className.getClassName(undefined, 'modifier').should.equal(`${BASE_CLASS}_modifier`);
    className.getClassName(null, 'modifier').should.equal(`${BASE_CLASS}_modifier`);
    className.getClassName('', 'modifier').should.equal(`${BASE_CLASS}_modifier`);
    className.getClassName(false, 'modifier').should.equal(`${BASE_CLASS}_modifier`);
  });

  it('getClassName() with both arguments should return valid BEM-name', () => {
    className.getClassName('element', 'modifier').should.equal(`${BASE_CLASS}__element_modifier`);
  });

  describe('shortcuts', () => {
    it('getElement() should return element', () => {
      className.getElement('element').should.equal(`${BASE_CLASS}__element`);
    });

    it('getModifier() should return modifier', () => {
      className.getModifier('modifier').should.equal(`${BASE_CLASS}_modifier`);
    });
  });
});
