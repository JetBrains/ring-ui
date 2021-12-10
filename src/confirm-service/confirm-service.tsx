import React, {ReactNode} from 'react';
import {render} from 'react-dom';

import Confirm, {ConfirmAttributes} from '../confirm/confirm';

/**
 * @name Confirm Service
 */

export const containerElement = document.createElement('div');

/**
 * Renders Confirm into virtual node to skip maintaining container
 */
function renderConfirm(props: ConfirmAttributes) {
  render(<Confirm {...props}/>, containerElement);
}

export interface ConfirmServiceParams {
  text?: string | undefined
  description?: ReactNode
  cancelIsDefault?: boolean | undefined
  confirmLabel?: string | undefined
  rejectLabel?: string | undefined
  onBeforeConfirm?: (() => void) | undefined
}

export default function confirm({
  text,
  description,
  confirmLabel = 'OK',
  rejectLabel = 'Cancel',
  cancelIsDefault,
  onBeforeConfirm
}: ConfirmServiceParams) {
  return new Promise<void>((resolve, reject) => {
    const props = {
      text,
      description,
      confirmLabel,
      rejectLabel,
      cancelIsDefault,
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
