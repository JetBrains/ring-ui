import React from 'react';

import {render, unmountComponentAtNode} from '../global/react-render-adapter';

import LoginDialog from './login-dialog';

const containerElement = document.createElement('div');

/**
 * Renders LoginDialog into virtual node to skip maintaining container
 */
function renderLoginDialog(props) {
  render(<LoginDialog {...props}/>, containerElement);
}

export default function showAuthDialog(props = {}) {
  renderLoginDialog({
    ...props,
    show: true
  });

  return () => {
    unmountComponentAtNode(containerElement);
  };
}
