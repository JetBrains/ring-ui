import dataTests from './data-tests';

describe('dataTests', () => {
  it('should join strings', () => {
    dataTests('foo', 'bar').should.be.equal('foo bar');
  });

  it('should ignore nulls', () => {
    dataTests('foo', null, undefined, '', 'bar').should.be.equal('foo bar');
  });

  it('should support map-like arguments', () => {
    dataTests('foo', {
      bar: true,
      notBar: false,
    }).should.be.equal('foo bar');
  });
});
