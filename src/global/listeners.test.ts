import {Stub} from '../../test-helpers/globals.d';

import Listeners from './listeners';

describe('Listeners', () => {
  let listeners: Listeners;
  let stub: Stub<() => Promise<string>>;
  let secondStub: Stub<() => string>;
  beforeEach(() => {
    listeners = new Listeners();
    stub = sandbox.stub<[]>().returns(Promise.resolve('result 1'));
    secondStub = sandbox.stub<[]>().returns('result 2');
  });

  it('should construct empty mao', () => {
    listeners._all.size.should.equal(0);
  });

  it('should add handler', () => {
    listeners.add('test', stub);
    listeners._all.size.should.equal(1);
    listeners._all.get('test')!.size.should.equal(1);
  });

  it('should trigger handler', () => {
    listeners.add('test', stub);

    listeners.trigger('test');

    stub.should.have.been.calledOnce;
  });

  it('should trigger all handlers', () => {
    listeners.add('test', stub);
    listeners.add('test', secondStub);

    listeners.trigger('test');

    stub.should.have.been.calledOnce;
    secondStub.should.have.been.calledOnce;
  });

  it('should return array of return values of all handlers', async () => {
    listeners.add('test', stub);
    listeners.add('test', secondStub);

    const results = await listeners.trigger('test');

    results.should.include.members(['result 1', 'result 2']);
  });

  it('should trigger all handlers only for passed event', () => {
    listeners.add('test', stub);
    listeners.add('test2', secondStub);

    listeners.trigger('test');

    stub.should.have.been.calledOnce;
    secondStub.should.not.have.been.calledOnce;
  });

  it('should remove handler', () => {
    listeners.add('test', stub);
    listeners.add('test', secondStub);

    listeners.remove('test', secondStub);

    listeners._all.size.should.equal(1);
    listeners._all.get('test')!.size.should.equal(1);
  });

  it('should remove all', () => {
    listeners.add('test', stub);
    listeners.add('test', secondStub);

    listeners.removeAll();

    listeners._all.size.should.equal(0);
  });
});
