import React from 'react';
import {render} from 'react-dom';

import AuthDialog, {AuthDialogProps} from '../auth-dialog/auth-dialog';

/**
 * @name Auth Dialog Service
 */

const containerElement = document.createElement('div');

type AuthDialogAttributes = JSX.LibraryManagedAttributes<typeof AuthDialog, AuthDialogProps>

/**
 * Renders AuthDialog into virtual node to skip maintaining container
 */
function renderAuthDialog(props: AuthDialogAttributes) {
  render(<AuthDialog {...props}/>, containerElement);
}

export default function showAuthDialog(props: AuthDialogAttributes = {}) {
  renderAuthDialog({
    ...props,
    show: true
  });

  return () => {
    renderAuthDialog({show: false});
  };
}
