/* eslint-disable @typescript-eslint/no-magic-numbers */

import LoaderCore, {LoaderCoreProps} from './loader__core';

describe('Loader', () => {
  function noop() {}

  let createLoader: (props: Partial<LoaderCoreProps>) => void;
  let loaderContainer;
  let loader: LoaderCore;

  beforeEach(() => {
    sandbox.stub(LoaderCore.prototype, 'loop').callsFake(() => {});

    createLoader = props => {
      loaderContainer = document.createElement('div');
      loader = new LoaderCore(loaderContainer, props);
    };

    createLoader({});
  });

  afterEach(() => loader.destroy());

  it('Should calculate gradient', () => {
    const middleColor = LoaderCore.calculateGradient({r: 0, g: 0, b: 0}, {r: 255, g: 255, b: 255}, 0.5);
    expect(middleColor).to.deep.equal({r: 128, g: 128, b: 128});
  });

  it('Should do some initial steps to prepare tail for first render', () => {
    expect(loader.particles.length).to.be.at.least(90);
  });

  it('Should set canvas size from passed size', () => {
    sandbox.stub(LoaderCore, 'getPixelRatio').returns(1);
    createLoader({size: 42});

    expect(loader.canvas.height).to.equal(42);
    expect(loader.canvas.width).to.equal(42);
  });

  it('Should double canvas size on HDPI devices', () => {
    sandbox.stub(LoaderCore, 'getPixelRatio').returns(2);
    createLoader({size: 42});

    expect(loader.canvas.height).to.equal(84);
    expect(loader.canvas.width).to.equal(84);
  });

  it('Should fixate canvas CSS size with style to avoid scaling on HDPI devices', () => {
    sandbox.stub(LoaderCore, 'getPixelRatio').returns(2);
    createLoader({size: 42});

    expect(loader.canvas.style.height).to.equal('42px');
    expect(loader.canvas.style.width).to.equal('42px');
  });

  it('Should start loop on constructing', () => {
    expect(loader.isRunning).to.be.true;
  });

  it('Should stop loop on destroy', () => {
    loader.destroy();
    expect(loader.isRunning).to.be.false;
  });

  it('Should revert direction on reaching top limit', () => {
    sandbox.stub(Math, 'random').returns(loader.baseSpeed / 2);

    const oldSpeed = loader.baseSpeed;
    const newSpeed = loader.handleLimits(95, 8, oldSpeed, 100);
    expect(newSpeed).to.equal(-loader.baseSpeed);
  });

  it('Should revert direction on reaching zero limit', () => {
    sandbox.stub(Math, 'random').returns(loader.baseSpeed / 2);

    const oldSpeed = -loader.baseSpeed;
    const newSpeed = loader.handleLimits(0, 8, oldSpeed, 100);
    expect(newSpeed).to.equal(loader.baseSpeed);
  });

  it('Should update radius according to radius change speed', () => {
    loader.radius = 4;
    loader.radiusSpeed = 2;

    loader.calculateNextRadius();

    expect(loader.radius).to.equal(6);
  });

  it('Should mirror radius change speed on reaching top limit', () => {
    loader.radius = 4;
    loader.maxRadius = 5;
    loader.radiusSpeed = 2;

    loader.calculateNextRadius();

    expect(loader.radiusSpeed).to.equal(-2);
  });

  it('Should mirror radius change speed on reaching low limit', () => {
    loader.radius = 4;
    loader.minRadius = 3;
    loader.radiusSpeed = -2;

    loader.calculateNextRadius();

    expect(loader.radiusSpeed).to.equal(2);
  });

  it('Should call next color calculation', () => {
    sandbox.spy(LoaderCore, 'calculateGradient');
    loader.colorIndex = 1;

    loader.getNextColor();
    expect(LoaderCore.calculateGradient).to.have.been.calledWith(
      loader.props.colors[1],
      loader.props.colors[2],
      sandbox.match(Number),
    );
  });

  it('Should update tick', () => {
    loader.tick = 1;
    loader.nextTick();

    expect(loader.tick).to.equal(2);
  });

  it('Should reset tick and update color after reaching limit', () => {
    loader.tick = loader.colorChangeTick;
    loader.colorIndex = 1;
    loader.nextTick();

    expect(loader.tick).to.equal(0);
    expect(loader.colorIndex).to.equal(2);
  });

  it('Should reset colorIndex to 0 if end is reached', () => {
    loader.tick = loader.colorChangeTick;
    loader.colorIndex = loader.props.colors.length - 1;
    loader.nextTick();

    expect(loader.colorIndex).to.equal(0);
  });

  it('Should update tick on step', () => {
    sandbox.spy(loader, 'nextTick');
    loader.step();
    expect(loader.nextTick).to.have.been.called;
  });

  it('Should calculate new coordinates on step', () => {
    sandbox.spy(loader, 'calculateNextCoordinates');
    loader.step();
    expect(loader.calculateNextCoordinates).to.have.been.called;
  });

  it('Should calculate new radius on step', () => {
    sandbox.spy(loader, 'calculateNextRadius');
    loader.step();
    expect(loader.calculateNextRadius).to.have.been.called;
  });

  it('Should call step for each particle to allow it to update its live points', () => {
    const stepSpy = sandbox.spy();
    loader.particles = [{step: stepSpy, draw: noop, isAlive: () => true}];

    loader.step();
    expect(stepSpy).to.have.been.called;
  });

  it('Should add particle on step', () => {
    loader.particles = [];
    loader.step();

    expect(loader.particles.length).to.equal(1);
  });

  it('Should remove dead particles', () => {
    loader.particles = [
      {isAlive: () => true, step: noop, draw: noop},
      {isAlive: () => false, step: noop, draw: noop},
      {isAlive: () => true, step: noop, draw: noop},
    ];

    loader.removeDeadParticles();

    expect(loader.particles.length).to.equal(2);
  });
});
