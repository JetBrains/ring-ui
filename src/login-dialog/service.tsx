import {createRoot} from 'react-dom/client';

import {ControlsHeightContext, getGlobalControlsHeight} from '../global/controls-height';

import LoginDialog, {LoginDialogAttrs} from './login-dialog';

const containerElement = document.createElement('div');
const reactRoot = createRoot(containerElement);

/**
 * Renders LoginDialog into virtual node to skip maintaining container
 */
function renderLoginDialog(props: LoginDialogAttrs) {
  reactRoot.render(
    <ControlsHeightContext.Provider value={getGlobalControlsHeight()}>
      <LoginDialog {...props} />
    </ControlsHeightContext.Provider>,
  );
}

function noop() {}
export default function showAuthDialog(props: LoginDialogAttrs = {onCancel: noop}) {
  renderLoginDialog({
    ...props,
    show: true,
  });

  return () => {
    renderLoginDialog({
      ...props,
      show: false,
    });
  };
}
