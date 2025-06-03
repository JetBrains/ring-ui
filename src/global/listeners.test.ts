import {Mock} from 'vitest';

import Listeners from './listeners';

describe('Listeners', () => {
  let listeners: Listeners;
  let stub: Mock<() => Promise<string>>;
  let secondStub: Mock<() => string>;
  beforeEach(() => {
    listeners = new Listeners();
    stub = vi.fn().mockReturnValue(Promise.resolve('result 1'));
    secondStub = vi.fn().mockReturnValue('result 2');
  });

  it('should construct empty mao', () => {
    expect(listeners._all.size).to.equal(0);
  });

  it('should add handler', () => {
    listeners.add('test', stub);
    expect(listeners._all.size).to.equal(1);
    expect(listeners._all.get('test')!.size).to.equal(1);
  });

  it('should trigger handler', () => {
    listeners.add('test', stub);

    listeners.trigger('test');

    expect(stub).toHaveBeenCalledOnce;
  });

  it('should trigger all handlers', () => {
    listeners.add('test', stub);
    listeners.add('test', secondStub);

    listeners.trigger('test');

    expect(stub).toHaveBeenCalledOnce;
    expect(secondStub).toHaveBeenCalledOnce;
  });

  it('should return array of return values of all handlers', async () => {
    listeners.add('test', stub);
    listeners.add('test', secondStub);

    const results = await listeners.trigger('test');

    expect(results).to.include.members(['result 1', 'result 2']);
  });

  it('should trigger all handlers only for passed event', () => {
    listeners.add('test', stub);
    listeners.add('test2', secondStub);

    listeners.trigger('test');

    expect(stub).toHaveBeenCalledOnce;
    expect(secondStub).not.toHaveBeenCalledOnce;
  });

  it('should remove handler', () => {
    listeners.add('test', stub);
    listeners.add('test', secondStub);

    listeners.remove('test', secondStub);

    expect(listeners._all.size).to.equal(1);
    expect(listeners._all.get('test')!.size).to.equal(1);
  });

  it('should remove all', () => {
    listeners.add('test', stub);
    listeners.add('test', secondStub);

    listeners.removeAll();

    expect(listeners._all.size).to.equal(0);
  });
});
