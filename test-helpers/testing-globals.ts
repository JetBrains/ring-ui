// chai-as-promised uses es6
import chaiAsPromised from 'chai-as-promised';
import chaiDOM from 'chai-dom';

chai.use(chaiAsPromised);
chai.use(chaiDOM);

afterEach(function restoreSandbox() {
  vi.useRealTimers();
});

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
