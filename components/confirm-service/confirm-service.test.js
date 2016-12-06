import TestUtils from 'react-addons-test-utils';
import confirm, {hideConfirm} from './confirm-service';
import styles from '../confirm/confirm.css';

describe('Confirm Service', () => {
  const getContainer = () => document.querySelector('*[data-test="ring-dialog"]');

  afterEach(hideConfirm);

  it('should show confirm', () => {
    confirm('foo');
    getContainer().should.contain(`.${styles.text}`);
  });

  it('should show confirm text', () => {
    confirm('foo');
    getContainer().should.contain.text('foo');
  });

  it('should show confirm description', () => {
    confirm('foo', 'descr');
    getContainer().should.contain.text('descr');
  });

  it('should show confirm button text', () => {
    confirm('foo', '', 'confirm text');
    getContainer().should.contain.text('confirm text');
  });

  it('should show reject button text', () => {
    confirm('foo', '', '', 'reject text');
    getContainer().should.contain.text('reject text');
  });

  it('should resolve on confirm', async () => {
    const spy = sinon.spy();
    const promise = confirm('foo').then(spy);
    const okButton = getContainer().querySelector('*[data-test="confirm-ok-button"]');
    TestUtils.Simulate.click(okButton);

    await promise;
    spy.should.have.been.called;
  });

  it('should reject on reject', async () => {
    const spy = sinon.spy();
    const promise = confirm('foo').catch(spy);
    const okButton = getContainer().querySelector('*[data-test="confirm-reject-button"]');
    TestUtils.Simulate.click(okButton);

    await promise;
    spy.should.have.been.called;
  });
});
