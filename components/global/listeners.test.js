/* eslint-disable func-names */
import Listeners from './listeners';

describe('Listeners', () => {
  beforeEach(function () {
    this.listeners = new Listeners();
    this.stub = this.sinon.stub().returns(Promise.resolve('result 1'));
    this.secondStub = this.sinon.stub().returns('result 2');
  });

  it('should construct empty mao', function () {
    this.listeners._all.size.should.equal(0);
  });

  it('should add handler', function () {
    this.listeners.add('test', this.stub);
    this.listeners._all.size.should.equal(1);
    this.listeners._all.get('test').size.should.equal(1);
  });

  it('should trigger handler', function () {
    this.listeners.add('test', this.stub);

    this.listeners.trigger('test');

    this.stub.should.have.been.called.once;
  });

  it('should trigger all handlers', function () {
    this.listeners.add('test', this.stub);
    this.listeners.add('test', this.secondStub);

    this.listeners.trigger('test');

    this.stub.should.have.been.called.once;
    this.secondStub.should.have.been.called.once;
  });

  it('should return array of return values of all handlers', async function () {
    this.listeners.add('test', this.stub);
    this.listeners.add('test', this.secondStub);

    const results = await this.listeners.trigger('test');

    results.should.include.members(['result 1', 'result 2']);
  });

  it('should trigger all handlers only for passed event', function () {
    this.listeners.add('test', this.stub);
    this.listeners.add('test2', this.secondStub);

    this.listeners.trigger('test');

    this.stub.should.have.been.called.once;
    this.secondStub.should.not.have.been.called.once;
  });

  it('should remove handler', function () {
    this.listeners.add('test', this.stub);
    this.listeners.add('test', this.secondStub);

    this.listeners.remove('test', this.secondStub);

    this.listeners._all.size.should.equal(1);
    this.listeners._all.get('test').size.should.equal(1);
  });

  it('should remove all', function () {
    this.listeners.add('test', this.stub);
    this.listeners.add('test', this.secondStub);

    this.listeners.removeAll();

    this.listeners._all.size.should.equal(0);
  });
});
