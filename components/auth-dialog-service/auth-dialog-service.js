import React from 'react';
import {render} from 'react-dom';

import AuthDialog from '../auth-dialog/auth-dialog';

/**
 * @name Auth Dialog Service
 */

const containerElement = document.createElement('div');

/**
 * Renders AuthDialog into virtual node to skip maintaining container
 */
function renderAuthDialog(props) {
  render(<AuthDialog {...props}/>, containerElement);
}

export default function showAuthDialog(props = {}) {
  renderAuthDialog({
    ...props,
    show: true
  });

  return () => {
    renderAuthDialog({show: false});
  };
}
