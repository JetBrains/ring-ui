// chai-as-promised uses es6
import 'core-js/es6';

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
  sandbox: sinon.sandbox.create(),
  chai,
  expect: chai.expect,
  should: chai.should()
});

afterEach(function restoreSandbox() {
  window.sandbox.restore();

  Array.from(document.body.children).forEach(child => {
    if (child.tagName.toLowerCase() === 'div') {
      unmountComponentAtNode(child);
    }
  });
});
