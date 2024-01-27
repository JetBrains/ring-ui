/* eslint-disable @typescript-eslint/no-magic-numbers */
import {toPx} from './utils';

describe('toPx', () => {
  it('converts a number to a px string', () => {
    toPx(10).should.be.to.equal('10px');
    toPx(0).should.be.equal('0px');
    toPx(-5).should.be.equal('-5px');
  });
});
