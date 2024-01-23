/* eslint-disable @typescript-eslint/no-magic-numbers */
import {getElementHeight, toPx} from './utils';

describe('getElementHeight', () => {
  it('returns the height of the element', () => {
    const element = {
      getBoundingClientRect: sinon.stub().returns({height: 100})
    };

    const height = getElementHeight(element as unknown as HTMLDivElement);

    height.should.equal(100);
  });

  it('returns 0 when element is null or undefined', () => {
    const height = getElementHeight(null);
    height.should.equal(0);
  });

  it('returns 0 when getBoundingClientRect is not defined', () => {
    const element = {};
    const height = getElementHeight(element as unknown as HTMLDivElement);
    height.should.equal(0);
  });
});

describe('toPx', () => {
  it('converts a number to a px string', () => {
    toPx(10).should.be.to.equal('10px');
    toPx(0).should.be.equal('0px');
    toPx(-5).should.be.equal('-5px');
  });
});
