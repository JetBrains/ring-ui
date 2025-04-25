import dataTests from './data-tests';

describe('dataTests', () => {
  it('should join strings', () => {
    expect(dataTests('foo', 'bar')).to.be.equal('foo bar');
  });

  it('should ignore nulls', () => {
    expect(dataTests('foo', null, undefined, '', 'bar')).to.be.equal('foo bar');
  });

  it('should support map-like arguments', () => {
    expect(
      dataTests('foo', {
        bar: true,
        notBar: false,
      }),
    ).to.be.equal('foo bar');
  });
});
