import {Simulate} from 'react-dom/test-utils';

import islandStyles from '../island/island.css';

import confirm, {hideConfirm} from './confirm-service';

describe('Confirm Service', () => {
  const getContainer = () => document.querySelector('*[data-test="ring-dialog"]');

  afterEach(hideConfirm);

  it('should show confirm', () => {
    confirm({text: 'foo'});
    getContainer().should.contain(`.${islandStyles.title}`);
  });

  it('should show confirm text', () => {
    confirm({text: 'foo'});
    getContainer().should.contain.text('foo');
  });

  it('should show confirm description', () => {
    confirm({text: 'foo', description: 'descr'});
    getContainer().should.contain.text('descr');
  });

  it('should show confirm button text', () => {
    confirm({text: 'foo', confirmLabel: 'confirm text'});
    getContainer().should.contain.text('confirm text');
  });

  it('should show reject button text', () => {
    confirm({text: 'foo', rejectLabel: 'reject text'});
    getContainer().should.contain.text('reject text');
  });

  it('should resolve on confirm', async () => {
    const spy = sinon.spy();
    const promise = confirm({text: 'foo'}).then(spy);
    const okButton = getContainer().querySelector('*[data-test="confirm-ok-button"]');
    Simulate.click(okButton);

    await promise;
    spy.should.have.been.called;
  });

  it('should reject on reject', async () => {
    const spy = sinon.spy();
    const promise = confirm({text: 'foo'}).catch(spy);
    const okButton = getContainer().querySelector('*[data-test="confirm-reject-button"]');
    Simulate.click(okButton);

    await promise;
    spy.should.have.been.called;
  });
});
