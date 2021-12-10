import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';

import LoginDialog, {LoginDialogAttrs} from './login-dialog';

const containerElement = document.createElement('div');

/**
 * Renders LoginDialog into virtual node to skip maintaining container
 */
function renderLoginDialog(props: LoginDialogAttrs) {
  render(<LoginDialog {...props}/>, containerElement);
}

function noop() {}
export default function showAuthDialog(props: LoginDialogAttrs = {onCancel: noop}) {
  renderLoginDialog({
    ...props,
    show: true
  });

  return () => {
    unmountComponentAtNode(containerElement);
  };
}
