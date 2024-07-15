import {ReactNode} from 'react';

import {createRoot} from 'react-dom/client';

import Confirm, {ConfirmAttributes} from '../confirm/confirm';
import {
  ControlsHeight,
  ControlsHeightContext,
  getGlobalControlsHeight
} from '../global/controls-height';

/**
 * @name Confirm Service
 */

export type Props = ConfirmAttributes & {
  buttonsHeight?: ControlsHeight
};

const containerElement = document.createElement('div');
export const reactRoot = createRoot(containerElement);

/**
 * Renders Confirm into virtual node to skip maintaining container
 */
function renderConfirm(props: Props) {
  const {buttonsHeight = getGlobalControlsHeight(), ...restProps} = props;
  reactRoot.render(
    <ControlsHeightContext.Provider value={buttonsHeight}>
      <Confirm {...restProps}/>
    </ControlsHeightContext.Provider>
  );
}

export interface ConfirmServiceParams {
  text?: string | undefined
  description?: ReactNode
  cancelIsDefault?: boolean | undefined
  confirmLabel?: string | undefined
  rejectLabel?: string | undefined
  onBeforeConfirm?: (() => void) | undefined
  buttonsHeight?: ControlsHeight | undefined
}

export default function confirm({
  text,
  description,
  confirmLabel = 'OK',
  rejectLabel = 'Cancel',
  cancelIsDefault,
  onBeforeConfirm,
  buttonsHeight
}: ConfirmServiceParams) {
  return new Promise<void>((resolve, reject) => {
    const props = {
      text,
      description,
      confirmLabel,
      rejectLabel,
      cancelIsDefault,
      buttonsHeight,
      show: true,

      onConfirm: () => {
        if (onBeforeConfirm) {
          renderConfirm({...props, inProgress: true});
          return Promise.resolve(onBeforeConfirm()).
            then(() => {
              renderConfirm({...props, show: false});
              resolve();
            }).
            catch(err => {
              renderConfirm({...props, show: false});
              reject(err);
            });
        }
        renderConfirm({...props, show: false});
        return resolve();
      },

      onReject: () => {
        renderConfirm({...props, show: false});
        reject(new Error('Confirm(@jetbrains/ring-ui): null exception'));
      }
    };

    renderConfirm(props);
  });
}

export function hideConfirm() {
  renderConfirm({text: '', show: false});
}
