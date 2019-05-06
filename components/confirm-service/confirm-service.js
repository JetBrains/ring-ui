import React from 'react';
import {render} from 'react-dom';

import Confirm from '../confirm/confirm';

/**
 * @name Confirm Service
 */

export const containerElement = document.createElement('div');

/**
 * Renders Confirm into virtual node to skip maintaining container
 */
function renderConfirm(props) {
  render(<Confirm {...props}/>, containerElement);
}

export default function confirm({
  text,
  description,
  confirmLabel = 'OK',
  rejectLabel = 'Cancel',
  cancelIsDefault,
  onBeforeConfirm
}) {
  return new Promise((resolve, reject) => {
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
              renderConfirm({show: false});
              resolve();
            }).
            catch(err => {
              renderConfirm({show: false});
              reject(err);
            });
        }
        renderConfirm({show: false});
        return resolve();
      },

      onReject: () => {
        renderConfirm({show: false});
        reject(new Error('Confirm(@jetbrains/ring-ui): null exception'));
      }
    };

    renderConfirm(props);
  });
}

export function hideConfirm() {
  renderConfirm({show: false});
}
