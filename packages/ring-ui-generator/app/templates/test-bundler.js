// chai-as-promised uses es6
import 'core-js/es6';

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
  should: chai.should()
});

const testsContext = require.context('./src', true, /\.test\.js$/);

testsContext.keys().forEach(testsContext);
