
import {toPx} from './utils';

describe('toPx', () => {
  it('converts a number to a px string', () => {
    expect(toPx(10)).to.be.to.equal('10px');
    expect(toPx(0)).to.be.equal('0px');
    expect(toPx(-5)).to.be.equal('-5px');
  });
});
