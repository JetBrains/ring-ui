import {Simulate} from 'react-dom/test-utils';
import {unmountComponentAtNode} from 'react-dom';

import islandStyles from '../island/island.css';

import confirm, {containerElement} from './confirm-service';

describe('Confirm Service', () => {
  const getContainer = () => document.querySelector('[data-test~="ring-dialog"]');

  afterEach(() => {
    unmountComponentAtNode(containerElement);
  });

  it('should show confirm', () => {
    confirm({text: 'foo'});
    const container = getContainer();
    should.exist(container);
    container?.should.contain(`.${islandStyles.title}`);
  });

  it('should show confirm text', () => {
    confirm({text: 'foo'});
    const container = getContainer();
    should.exist(container);
    container?.should.contain.text('foo');
  });

  it('should show confirm description', () => {
    confirm({text: 'foo', description: 'descr'});
    const container = getContainer();
    should.exist(container);
    container?.should.contain.text('descr');
  });

  it('should show confirm button text', () => {
    confirm({text: 'foo', confirmLabel: 'confirm text'});
    const container = getContainer();
    should.exist(container);
    container?.should.contain.text('confirm text');
  });

  it('should show reject button text', () => {
    confirm({text: 'foo', rejectLabel: 'reject text'});
    const container = getContainer();
    should.exist(container);
    container?.should.contain.text('reject text');
  });

  it('should resolve on confirm', async () => {
    const spy = sandbox.spy();
    const promise = confirm({text: 'foo'}).then(spy);
    const container = getContainer();
    const okButton = container?.querySelector('*[data-test="confirm-ok-button"]');
    should.exist(okButton);
    okButton && Simulate.click(okButton);

    await promise;
    spy.should.have.been.called;
  });

  it('should reject on reject', async () => {
    const spy = sandbox.spy();
    const promise = confirm({text: 'foo'}).catch(spy);
    const container = getContainer();
    const okButton = container?.querySelector('*[data-test="confirm-reject-button"]');
    should.exist(okButton);
    okButton && Simulate.click(okButton);

    await promise;
    spy.should.have.been.called;
  });
});
