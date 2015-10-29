import Loader from './loader';

describe.only('Loader', function () {

  it('Should calculate gradient', function () {
    let middleColor = Loader.calculateGradient({r:0, g:0, b:0}, {r:255, g:255, b:255}, 0.5);
    middleColor.should.deep.equal({r: 128, g: 128, b: 128});
  });
});
