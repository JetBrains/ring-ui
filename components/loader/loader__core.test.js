/* eslint-disable func-names */

import LoaderCore from './loader__core';

describe('Loader', () => {
  function noop() {}

  beforeEach(function () {
    this.createLoader = function (props) {
      this.loaderContainer = document.createElement('div');
      this.loader = new LoaderCore(this.loaderContainer, props);
      return this.loader;
    };

    this.createLoader({});
  });

  it('Should calculate gradient', () => {
    const middleColor = LoaderCore.calculateGradient(
      {r: 0, g: 0, b: 0},
      {r: 255, g: 255, b: 255},
      0.5
    );
    middleColor.should.deep.equal({r: 128, g: 128, b: 128});
  });

  it('Should do some initial steps to prepare tail for first render', function () {
    this.loader.particles.length.should.be.at.least(90);
  });

  it('Should set canvas size from passed size', function () {
    this.sinon.stub(LoaderCore, 'getPixelRatio').returns(1);
    const loader = this.createLoader({size: 42});

    loader.canvas.height.should.equal(42);
    loader.canvas.width.should.equal(42);
  });

  it('Should double canvas size on HDPI devices', function () {
    this.sinon.stub(LoaderCore, 'getPixelRatio').returns(2);
    const loader = this.createLoader({size: 42});

    loader.canvas.height.should.equal(84);
    loader.canvas.width.should.equal(84);
  });

  it('Should fixate canvas CSS size with style to avoid scaling on HDPI devices', function () {
    this.sinon.stub(LoaderCore, 'getPixelRatio').returns(2);
    const loader = this.createLoader({size: 42});

    loader.canvas.style.height.should.equal('42px');
    loader.canvas.style.width.should.equal('42px');
  });

  it('Should scale canvas on HDPI devices to make visible image size the same as on normal screens', function () {
    this.sinon.stub(LoaderCore, 'getPixelRatio').returns(2);
    const loader = this.createLoader({size: 42});
    this.sinon.spy(loader.ctx, 'scale');

    loader.setCanvasSize();

    loader.ctx.scale.should.have.been.calledWith(2, 2);
  });

  it('Should scale canvas on zoomed out devices to avoid image cropping', function () {
    this.sinon.stub(LoaderCore, 'getPixelRatio').returns(0.5);
    const loader = this.createLoader({size: 42});
    this.sinon.spy(loader.ctx, 'scale');

    loader.setCanvasSize();

    loader.ctx.scale.should.have.been.calledWith(0.5, 0.5);
  });

  it('Should start loop on constructing', function () {
    this.loader.isRunning.should.be.true;
  });

  it('Should stop loop on destroy', function () {
    this.loader.destroy();
    this.loader.isRunning.should.be.false;
  });

  it('Should revert direction on reaching top limit', function () {
    this.sinon.stub(Math, 'random').returns(this.loader.baseSpeed / 2);

    const oldSpeed = this.loader.baseSpeed;
    const newSpeed = this.loader.handleLimits(95, 8, oldSpeed, 100);
    newSpeed.should.equal(-this.loader.baseSpeed);
  });

  it('Should revert direction on reaching zero limit', function () {
    this.sinon.stub(Math, 'random').returns(this.loader.baseSpeed / 2);

    const oldSpeed = -this.loader.baseSpeed;
    const newSpeed = this.loader.handleLimits(0, 8, oldSpeed, 100);
    newSpeed.should.equal(this.loader.baseSpeed);
  });

  it('Should update radius according to radius change speed', function () {
    this.loader.radius = 4;
    this.loader.radiusSpeed = 2;

    this.loader.calculateNextRadius();

    this.loader.radius.should.equal(6);
  });

  it('Should mirror radius change speed on reaching top limit', function () {
    this.loader.radius = 4;
    this.loader.maxRadius = 5;
    this.loader.radiusSpeed = 2;

    this.loader.calculateNextRadius();

    this.loader.radiusSpeed.should.equal(-2);
  });

  it('Should mirror radius change speed on reaching low limit', function () {
    this.loader.radius = 4;
    this.loader.minRadius = 3;
    this.loader.radiusSpeed = -2;

    this.loader.calculateNextRadius();

    this.loader.radiusSpeed.should.equal(2);
  });

  it('Should call next color calculation', function () {
    this.sinon.spy(LoaderCore, 'calculateGradient');
    this.loader.colorIndex = 1;

    this.loader.getNextColor();
    LoaderCore.calculateGradient.should.have.been.calledWith(
      this.loader.props.colors[1],
      this.loader.props.colors[2],
      this.sinon.match(Number)
    );
  });

  it('Should update tick', function () {
    this.loader.tick = 1;
    this.loader.nextTick();

    this.loader.tick.should.equal(2);
  });

  it('Should reset tick and update color after reaching limit', function () {
    this.loader.tick = this.loader.colorChangeTick;
    this.loader.colorIndex = 1;
    this.loader.nextTick();

    this.loader.tick.should.equal(0);
    this.loader.colorIndex.should.equal(2);
  });

  it('Should reset colorIndex to 0 if end is reached', function () {
    this.loader.tick = this.loader.colorChangeTick;
    this.loader.colorIndex = this.loader.props.colors.length - 1;
    this.loader.nextTick();

    this.loader.colorIndex.should.equal(0);
  });

  it('Should update tick on step', function () {
    this.sinon.spy(this.loader, 'nextTick');
    this.loader.step();
    this.loader.nextTick.should.have.been.called;
  });

  it('Should calculate new coordinates on step', function () {
    this.sinon.spy(this.loader, 'calculateNextCoordinates');
    this.loader.step();
    this.loader.calculateNextCoordinates.should.have.been.called;
  });

  it('Should calculate new radius on step', function () {
    this.sinon.spy(this.loader, 'calculateNextRadius');
    this.loader.step();
    this.loader.calculateNextRadius.should.have.been.called;
  });

  it('Should call step for each particle to allow it to update its live points', function () {
    const stepSpy = this.sinon.spy();
    this.loader.particles = [{step: stepSpy, draw: noop, isAlive: () => true}];

    this.loader.step();
    stepSpy.should.have.been.called;
  });

  it('Should add particle on step', function () {
    this.loader.particles = [];
    this.loader.step();

    this.loader.particles.length.should.equal(1);
  });

  it('Should remove dead particles', function () {
    this.loader.particles = [
      {isAlive: () => true, step: noop, draw: noop},
      {isAlive: () => false, step: noop, draw: noop},
      {isAlive: () => true, step: noop, draw: noop}
    ];

    this.loader.removeDeadParticles();

    this.loader.particles.length.should.equal(2);
  });

  it('Should clear canvas before rendering new frame', function () {
    this.sinon.spy(this.loader.ctx, 'clearRect');

    this.loader.draw();

    this.loader.ctx.clearRect.should.have.been.called;
  });

  it('Should call draw for each particle', function () {
    const drawSpy = this.sinon.spy();
    this.loader.particles = [{draw: drawSpy, isAlive: () => true, step: noop}];

    this.loader.draw();
    drawSpy.should.have.been.called;
  });
});
