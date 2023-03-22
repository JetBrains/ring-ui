import React from 'react';

import {render, unmountComponentAtNode} from '../global/react-render-adapter';

import {ControlsHeightContext, getGlobalControlsHeight} from '../global/controls-height';

import LoginDialog, {LoginDialogAttrs} from './login-dialog';

const containerElement = document.createElement('div');

/**
 * Renders LoginDialog into virtual node to skip maintaining container
 */
function renderLoginDialog(props: LoginDialogAttrs) {
  render(
    (
      <ControlsHeightContext.Provider value={getGlobalControlsHeight()}>
        <LoginDialog {...props}/>
      </ControlsHeightContext.Provider>
    ),
    containerElement
  );
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
