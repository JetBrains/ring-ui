import {createRoot} from 'react-dom/client';

import {ControlsHeightContext, getGlobalControlsHeight} from '../global/controls-height';
import AuthDialog, {type AuthDialogProps} from '../auth-dialog/auth-dialog';

/**
 * @name Auth Dialog Service
 */

const containerElement = document.createElement('div');
export const reactRoot = createRoot(containerElement);

type AuthDialogAttributes = React.JSX.LibraryManagedAttributes<typeof AuthDialog, AuthDialogProps>;

/**
 * Renders AuthDialog into virtual node to skip maintaining container
 */
function renderAuthDialog(props: AuthDialogAttributes) {
  reactRoot.render(
    <ControlsHeightContext.Provider value={getGlobalControlsHeight()}>
      <AuthDialog {...props} />
    </ControlsHeightContext.Provider>,
  );
}

export default function showAuthDialog(props: AuthDialogAttributes = {}) {
  renderAuthDialog({
    ...props,
    show: true,
  });

  return () => {
    renderAuthDialog({show: false});
  };
}
