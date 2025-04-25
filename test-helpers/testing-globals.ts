// chai-as-promised uses es6
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiDOM from 'chai-dom';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';

chai.use(chaiAsPromised);
chai.use(chaiDOM);
chai.use(sinonChai);

const windowExtension = {
  sinon,
  sandbox: sinon.createSandbox(),
};

type WindowExtension = typeof windowExtension;

declare global {
  interface Window extends WindowExtension {}
}

Object.assign(window, windowExtension);

afterEach(function restoreSandbox() {
  vi.useRealTimers();
  window.sandbox.restore();
});

window.global = window as never;

Range.prototype.getBoundingClientRect = () => ({
  x: 0,
  y: 0,
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  toJSON: () => {},
});
