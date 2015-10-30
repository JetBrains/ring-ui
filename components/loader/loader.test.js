import React from 'react';
import Loader from './loader';
import TestUtils from 'react-addons-test-utils';

describe('Loader', function () {
  beforeEach(function () {
    this.loader = TestUtils.renderIntoDocument(React.createElement(Loader));
  });

  it('Should calculate gradient', function () {
    const middleColor = Loader.calculateGradient({r: 0, g: 0, b: 0}, {r: 255, g: 255, b: 255}, 0.5);
    middleColor.should.deep.equal({r: 128, g: 128, b: 128});
  });

  it('Should do some initial steps to prepare tail for first render', function () {
    this.loader.particles.length.should.be.at.least(90);
  });

  it('Should set canvas size from passed size', function () {
    this.sinon.stub(Loader, 'getPixelRatio').returns(1);
    this.loader = TestUtils.renderIntoDocument(React.createElement(Loader, {size: 42}));

    this.loader.refs.canvas.height.should.equal(42);
    this.loader.refs.canvas.width.should.equal(42);
  });

  it('Should double canvas size on HDPI devices', function () {
    this.sinon.stub(Loader, 'getPixelRatio').returns(2);
    this.loader = TestUtils.renderIntoDocument(React.createElement(Loader, {size: 42}));

    this.loader.refs.canvas.height.should.equal(84);
    this.loader.refs.canvas.width.should.equal(84);
  });

  it('Should fixate canvas CSS size with style to avoid scaling on HDPI devices', function () {
    this.sinon.stub(Loader, 'getPixelRatio').returns(2);
    this.loader = TestUtils.renderIntoDocument(React.createElement(Loader, {size: 42}));

    this.loader.refs.canvas.style.height.should.equal('42px');
    this.loader.refs.canvas.style.width.should.equal('42px');
  });

  it('Should scale canvas on HDPI devices to make visible image size the same as on normal screens', function () {
    this.sinon.stub(Loader, 'getPixelRatio').returns(2);
    this.loader = TestUtils.renderIntoDocument(React.createElement(Loader));
    this.sinon.spy(this.loader.ctx, 'scale');

    this.loader.setCanvasSize();

    this.loader.ctx.scale.should.have.been.calledWith(2, 2);
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
    this.sinon.spy(Loader, 'calculateGradient');
    this.loader.colorIndex = 1;

    this.loader.getNextColor();
    Loader.calculateGradient.should.have.been
      .calledWith(this.loader.props.colors[1], this.loader.props.colors[2], this.sinon.match(Number));
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
    this.loader.particles = [{step: stepSpy}];

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
      {isAlive: () => true},
      {isAlive: () => false},
      {isAlive: () => true}
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
    this.loader.particles = [{draw: drawSpy, isAlive: () => true}];

    this.loader.draw();
    drawSpy.should.have.been.called;
  });
});
