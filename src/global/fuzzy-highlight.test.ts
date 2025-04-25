import fuzzyHighlight from './fuzzy-highlight';

describe('fuzzyHighlight', () => {
  it('should match full haystack', () => {
    expect(fuzzyHighlight('cartwheel', 'cartwheel')).to.deep.equal({
      matched: true,
      matches: [{from: 0, to: 9}],
      highlight: '**cartwheel**',
    });
  });
  it('should match part of the haystack', () => {
    expect(fuzzyHighlight('car', 'cartwheel')).to.deep.equal({
      matched: true,
      matches: [{from: 0, to: 3}],
      highlight: '**car**twheel',
    });
    expect(fuzzyHighlight('cwhl', 'cartwheel')).to.deep.equal({
      matched: true,
      matches: [
        {from: 0, to: 1},
        {from: 4, to: 6},
        {from: 8, to: 9},
      ],
      highlight: '**c**art**wh**ee**l**',
    });
    expect(fuzzyHighlight('cwheel', 'cartwheel')).to.deep.equal({
      matched: true,
      matches: [
        {from: 0, to: 1},
        {from: 4, to: 9},
      ],
      highlight: '**c**art**wheel**',
    });
  });
  it("shouldn't match needle with extra symbols", () => {
    expect(fuzzyHighlight('cwheeel', 'cartwheel')).to.deep.equal({
      matched: false,
      matches: [],
      highlight: 'cartwheel',
    });
  });
  it("shouldn't match needle with false order", () => {
    expect(fuzzyHighlight('lw', 'cartwheel')).to.deep.equal({
      matched: false,
      matches: [],
      highlight: 'cartwheel',
    });
  });
  it('should be case-insensitive by default', () => {
    expect(fuzzyHighlight('cAr', 'Cartwheel')).to.deep.equal({
      matched: true,
      matches: [{from: 0, to: 3}],
      highlight: '**Car**twheel',
    });
  });
  it('should allow case-sensitivity as an option', () => {
    expect(fuzzyHighlight('cAr', 'Cartwheel', true)).to.deep.equal({
      matched: false,
      matches: [],
      highlight: 'Cartwheel',
    });
    expect(fuzzyHighlight('Car', 'Cartwheel', true)).to.deep.equal({
      matched: true,
      matches: [{from: 0, to: 3}],
      highlight: '**Car**twheel',
    });
  });
});
