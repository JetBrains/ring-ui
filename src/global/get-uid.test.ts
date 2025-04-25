import getUID from './get-uid';

describe('getUid', () => {
  it('should throw an exception if the "name" argument isn\'t passed', () => {
    // @ts-expect-error testing a wrong usage
    expect(() => getUID()).to.throw(Error);
  });

  it('should return a unique id every time', () => {
    const id1 = getUID('test');
    const id2 = getUID('test');
    const id3 = getUID('test');

    expect(id1).to.not.be.equal(id2);
    expect(id2).to.not.be.equal(id3);
  });

  it('should return an id having a passed prefix', () => {
    expect(getUID('test')).to.have.string('test');
    expect(getUID('tset')).to.have.string('tset');
  });
});
