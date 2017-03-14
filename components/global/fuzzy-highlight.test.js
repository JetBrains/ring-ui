import fuzzyHighlight from './fuzzy-highlight';

describe('fuzzyHighlight', () => {
  it('should match full haystack', () => {
    fuzzyHighlight('cartwheel', 'cartwheel').should.deep.equal({
      matched: true,
      highlight: '**cartwheel**'
    });
  });
  it('should match part of the haystack', () => {
    fuzzyHighlight('car', 'cartwheel').should.deep.equal({
      matched: true,
      highlight: '**car**twheel'
    });
    fuzzyHighlight('cwhl', 'cartwheel').should.deep.equal({
      matched: true,
      highlight: '**c**art**wh**ee**l**'
    });
    fuzzyHighlight('cwheel', 'cartwheel').should.deep.equal({
      matched: true,
      highlight: '**c**art**wheel**'
    });
  });
  it('shouldn\'t match needle with extra symbols', () => {
    fuzzyHighlight('cwheeel', 'cartwheel').should.deep.equal({
      matched: false,
      highlight: 'cartwheel'
    });
  });
  it('shouldn\'t match needle with false order', () => {
    fuzzyHighlight('lw', 'cartwheel').should.deep.equal({
      matched: false,
      highlight: 'cartwheel'
    });
  });
  it('should be case-insensitive by default', () => {
    fuzzyHighlight('cAr', 'Cartwheel').should.deep.equal({
      matched: true,
      highlight: '**Car**twheel'
    });
  });
  it('should allow case-sensitivity as an option', () => {
    fuzzyHighlight('cAr', 'Cartwheel', true).should.deep.equal({
      matched: false,
      highlight: 'Cartwheel'
    });
    fuzzyHighlight('Car', 'Cartwheel', true).should.deep.equal({
      matched: true,
      highlight: '**Car**twheel'
    });
  });
});
