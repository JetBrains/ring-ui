// chai-as-promised uses es6
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiDOM from 'chai-dom';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

import {unmountComponentAtNode} from 'react-dom';

chai.use(chaiAsPromised);
chai.use(chaiDOM);
chai.use(sinonChai);
chai.use(chaiEnzyme());

const windowExtension = {
  sinon,
  sandbox: sinon.createSandbox(),
  chai,
  should: chai.should()
};

type WindowExtension = typeof windowExtension;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends WindowExtension {}
}

Object.assign(window, {
  sinon,
  sandbox: sinon.createSandbox(),
  chai,
  should: chai.should()
});

afterEach(function restoreSandbox() {
  window.sandbox.restore();

  Array.from(document.body.children).forEach(child => {
    if ('_reactRootContainer' in child) {
      unmountComponentAtNode(child);
    }
  });
});

window.global = window as never;
