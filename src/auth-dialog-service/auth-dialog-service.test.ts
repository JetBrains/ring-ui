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
    expect(container).to.exist;
  });

  it('should show auth dialog text', () => {
    hideAuthDialog = authDialog({title: 'foo'});
    const title = getContainer()?.querySelector(`.${styles.title}`);
    expect(title).to.exist;
    expect(title).to.contain.text('foo');
  });

  it('should show auth dialog error message', () => {
    hideAuthDialog = authDialog({title: 'foo', errorMessage: 'error mess'});
    const container = getContainer();
    expect(container).to.exist;
    expect(container).to.contain.text('error mess');
  });

  it('should show auth dialog serviceName', () => {
    hideAuthDialog = authDialog({serviceName: 'My service'});
    const title = getContainer()?.querySelector(`.${styles.title}`);
    expect(title).to.exist;
    expect(title).to.contain.text('Log in to My service');
  });

  it('should replace serviceName in in title', () => {
    hideAuthDialog = authDialog({title: '==%serviceName%==', serviceName: 'My service'});
    const title = getContainer()?.querySelector(`.${styles.title}`);
    expect(title).to.exist;
    expect(title).to.contain.text('==My service==');
  });

  it('should show auth dialog image', () => {
    hideAuthDialog = authDialog({serviceImage: 'image://url'});
    const container = getContainer();
    expect(container).to.exist;
    expect(container).to.contain('img[src="image://url"]');
  });

  it('should show auth dialog button text', () => {
    hideAuthDialog = authDialog({title: 'foo', confirmLabel: 'confirm text'});
    const container = getContainer();
    expect(container).to.exist;
    expect(container).to.contain.text('confirm text');
  });

  it('should show reject button text', () => {
    hideAuthDialog = authDialog({title: 'foo', cancelLabel: 'reject text'});
    const container = getContainer();
    expect(container).to.exist;
    expect(container).to.contain.text('reject text');
  });

  it('should call onConfirm on confirm click', () => {
    const onConfirm = sandbox.spy();
    hideAuthDialog = authDialog({onConfirm});
    const okButton = getContainer()?.querySelector('*[data-test="auth-dialog-confirm-button"]');
    expect(okButton).to.exist;
    fireEvent.click(okButton as Element);

    expect(onConfirm).to.have.been.called;
  });

  it('should call onCancel on cancel click', () => {
    const onCancel = sandbox.spy();
    hideAuthDialog = authDialog({onCancel});
    const cancelButton = getContainer()?.querySelector('*[data-test="auth-dialog-cancel-button"]');
    expect(cancelButton).to.exist;
    fireEvent.click(cancelButton as Element);

    expect(onCancel).to.have.been.called;
  });
});
