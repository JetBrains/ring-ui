import {Simulate} from 'react-dom/test-utils';

import styles from '../auth-dialog/auth-dialog.css';

import authDialog from './auth-dialog-service';

describe('Auth Dialog Service', () => {
  const getContainer = () => document.querySelector('*[data-test="ring-auth-dialog"]');
  let hideAuthDialog;

  afterEach(() => {
    hideAuthDialog();
  });

  it('should show auth dialog', () => {
    hideAuthDialog = authDialog();
    getContainer().should.contain(`.${styles.content}`);
  });

  it('should show auth dialog text', () => {
    hideAuthDialog = authDialog({title: 'foo'});
    getContainer().querySelector(`.${styles.title}`).should.contain.text('foo');
  });

  it('should show auth dialog error message', () => {
    hideAuthDialog = authDialog({title: 'foo', errorMessage: 'error mess'});
    getContainer().should.contain.text('error mess');
  });

  it('should show auth dialog serviceName', () => {
    hideAuthDialog = authDialog({serviceName: 'My service'});
    getContainer().querySelector(`.${styles.title}`).should.contain.text('Log in to My service');
  });

  it('should replace serviceName in in title', () => {
    hideAuthDialog = authDialog({title: '==%s==', serviceName: 'My service'});
    getContainer().querySelector(`.${styles.title}`).should.contain.text('==My service==');
  });

  it('should show auth dialog image', () => {
    hideAuthDialog = authDialog({serviceImage: 'image://url'});
    getContainer().should.contain('img[src="image://url"]');
  });

  it('should show auth dialog button text', () => {
    hideAuthDialog = authDialog({title: 'foo', loginLabel: 'confirm text'});
    getContainer().should.contain.text('confirm text');
  });

  it('should show reject button text', () => {
    hideAuthDialog = authDialog({title: 'foo', cancelLabel: 'reject text'});
    getContainer().should.contain.text('reject text');
  });

  it('should call onLogin on login click', async () => {
    const onLogin = sinon.spy();
    hideAuthDialog = authDialog({onLogin});
    const okButton = getContainer().querySelector('*[data-test="auth-dialog-login-button"]');
    Simulate.click(okButton);


    onLogin.should.have.been.called;
  });

  it('should call onCancel on cancel click', async () => {
    const onCancel = sinon.spy();
    hideAuthDialog = authDialog({onCancel});
    const cancelButton = getContainer().querySelector('*[data-test="auth-dialog-cancel-button"]');
    Simulate.click(cancelButton);

    onCancel.should.have.been.called;
  });
});
