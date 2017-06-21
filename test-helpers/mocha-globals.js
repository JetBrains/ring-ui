import {unmountComponentAtNode} from 'react-dom';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiDOM from 'chai-dom';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';

chai.use(chaiAsPromised);
chai.use(chaiDOM);
chai.use(sinonChai);
chai.use(chaiEnzyme());

Object.assign(window, {
  sinon,
  chai,
  expect: chai.expect,
  should: chai.should()
});

beforeEach(function createSandbox() {
  this.sinon = sinon.sandbox.create();
});

afterEach(function restoreSandbox() {
  this.sinon.restore();

  Array.from(document.body.children).forEach(child => {
    if (child.tagName.toLowerCase() === 'div') {
      unmountComponentAtNode(child);
    }
  });
});
