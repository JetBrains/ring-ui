import {ReactElement} from 'react';

import {render, fireEvent} from '@testing-library/react';

import styles from '../auth-dialog/auth-dialog.css';

import authDialog, {reactRoot} from './auth-dialog-service';

describe('Auth Dialog Service', () => {
  const getContainer = () => document.querySelector('*[data-test~="ring-auth-dialog"]');
  let hideAuthDialog: () => void;

  beforeEach(() => {
    sandbox.stub(reactRoot, 'render').callsFake(element => render(element as ReactElement));
  });

  afterEach(() => {
    hideAuthDialog();
  });

  it('should show auth dialog', () => {
    hideAuthDialog = authDialog();
    const container = getContainer()?.querySelector(`.${styles.content.split(' ').join('.')}`);
    should.exist(container);
  });

  it('should show auth dialog text', () => {
    hideAuthDialog = authDialog({title: 'foo'});
    const title = getContainer()?.querySelector(`.${styles.title}`);
    should.exist(title);
    title?.should.contain.text('foo');
  });

  it('should show auth dialog error message', () => {
    hideAuthDialog = authDialog({title: 'foo', errorMessage: 'error mess'});
    const container = getContainer();
    should.exist(container);
    container?.should.contain.text('error mess');
  });

  it('should show auth dialog serviceName', () => {
    hideAuthDialog = authDialog({serviceName: 'My service'});
    const title = getContainer()?.querySelector(`.${styles.title}`);
    should.exist(title);
    title?.should.contain.text('Log in to My service');
  });

  it('should replace serviceName in in title', () => {
    hideAuthDialog = authDialog({title: '==%serviceName%==', serviceName: 'My service'});
    const title = getContainer()?.querySelector(`.${styles.title}`);
    should.exist(title);
    title?.should.contain.text('==My service==');
  });

  it('should show auth dialog image', () => {
    hideAuthDialog = authDialog({serviceImage: 'image://url'});
    const container = getContainer();
    should.exist(container);
    container?.should.contain('img[src="image://url"]');
  });

  it('should show auth dialog button text', () => {
    hideAuthDialog = authDialog({title: 'foo', confirmLabel: 'confirm text'});
    const container = getContainer();
    should.exist(container);
    container?.should.contain.text('confirm text');
  });

  it('should show reject button text', () => {
    hideAuthDialog = authDialog({title: 'foo', cancelLabel: 'reject text'});
    const container = getContainer();
    should.exist(container);
    container?.should.contain.text('reject text');
  });

  it('should call onConfirm on confirm click', () => {
    const onConfirm = sandbox.spy();
    hideAuthDialog = authDialog({onConfirm});
    const okButton = getContainer()?.querySelector('*[data-test="auth-dialog-confirm-button"]');
    should.exist(okButton);
    fireEvent.click(okButton as Element);

    onConfirm.should.have.been.called;
  });

  it('should call onCancel on cancel click', () => {
    const onCancel = sandbox.spy();
    hideAuthDialog = authDialog({onCancel});
    const cancelButton = getContainer()?.querySelector('*[data-test="auth-dialog-cancel-button"]');
    should.exist(cancelButton);
    fireEvent.click(cancelButton as Element);

    onCancel.should.have.been.called;
  });
});
