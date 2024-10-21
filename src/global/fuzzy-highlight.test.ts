import fuzzyHighlight from './fuzzy-highlight';

describe('fuzzyHighlight', () => {
  it('should match full haystack', () => {
    fuzzyHighlight('cartwheel', 'cartwheel').should.deep.equal({
      matched: true,
      matches: [{from: 0, to: 9}],
      highlight: '**cartwheel**',
    });
  });
  it('should match part of the haystack', () => {
    fuzzyHighlight('car', 'cartwheel').should.deep.equal({
      matched: true,
      matches: [{from: 0, to: 3}],
      highlight: '**car**twheel',
    });
    fuzzyHighlight('cwhl', 'cartwheel').should.deep.equal({
      matched: true,
      matches: [
        {from: 0, to: 1},
        {from: 4, to: 6},
        {from: 8, to: 9},
      ],
      highlight: '**c**art**wh**ee**l**',
    });
    fuzzyHighlight('cwheel', 'cartwheel').should.deep.equal({
      matched: true,
      matches: [
        {from: 0, to: 1},
        {from: 4, to: 9},
      ],
      highlight: '**c**art**wheel**',
    });
  });
  it("shouldn't match needle with extra symbols", () => {
    fuzzyHighlight('cwheeel', 'cartwheel').should.deep.equal({
      matched: false,
      matches: [],
      highlight: 'cartwheel',
    });
  });
  it("shouldn't match needle with false order", () => {
    fuzzyHighlight('lw', 'cartwheel').should.deep.equal({
      matched: false,
      matches: [],
      highlight: 'cartwheel',
    });
  });
  it('should be case-insensitive by default', () => {
    fuzzyHighlight('cAr', 'Cartwheel').should.deep.equal({
      matched: true,
      matches: [{from: 0, to: 3}],
      highlight: '**Car**twheel',
    });
  });
  it('should allow case-sensitivity as an option', () => {
    fuzzyHighlight('cAr', 'Cartwheel', true).should.deep.equal({
      matched: false,
      matches: [],
      highlight: 'Cartwheel',
    });
    fuzzyHighlight('Car', 'Cartwheel', true).should.deep.equal({
      matched: true,
      matches: [{from: 0, to: 3}],
      highlight: '**Car**twheel',
    });
  });
});
