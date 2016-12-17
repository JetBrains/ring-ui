import getUID from './get-uid';

describe('getUid', () => {
  it('should throw an exception if the "name" argument isn\'t passed', () => {
    expect(() => getUID()).to.throw(Error);
  });

  it('should return a unique id every time', () => {
    const id1 = getUID('test');
    const id2 = getUID('test');
    const id3 = getUID('test');

    id1.should.not.be.equal(id2);
    id2.should.not.be.equal(id3);
  });

  it('should return an id having a passed prefix', () => {
    getUID('test').should.have.string('test');
    getUID('tset').should.have.string('tset');
  });

  it('should return an id starting with the "new-" prefix (for a while)', () => {
    getUID('test').should.match(/^new-/);
  });
});
