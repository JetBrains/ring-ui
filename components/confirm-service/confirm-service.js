import React from 'react';
import {render} from 'react-dom';

import Confirm from '../confirm/confirm';

/**
 * @name Confirm Service
 * @category Components
 * @framework React
 * @constructor
 * @description A wrapper for Confirm component. Allows showing confirmation dialog
 * without mounting Confirm component. Could be used outside React.
 * @example
 <example name="Confirm Service">
 <file name="index.html">
 <div id="confirm"></div>
 </file>

 <file name="index.js">
 import {render} from 'react-dom';
 import React from 'react';
 import confirm from 'ring-ui/components/confirm-service/confirm-service';
 import Button from 'ring-ui/components/button/button';

 class ConfirmDemo extends React.Component {
        componentDidMount() {
          this.showConfirm();
        }

        showConfirm = () => {
          return confirm({text: 'Do you really want to proceed?'}).
            then(() => console.info('Confirmed')).
            catch(() => console.warn('Rejected'));
        }

        showWithAnotherText = () => {
          return confirm({
            text: 'There is another confirmation',
            description: 'Confirmation description',
            confirmLabel: 'OK, confirm this',
            rejectLabel: 'NO, cancel!',
            cancelIsDefault: true,
            onBeforeConfirm: () => new Promise(resolve => setTimeout(resolve, 1000))
          }).
            then(() => console.info('Confirmed')).
            catch(() => console.warn('Rejected'));
        }

        render() {
          return (
            <div>
              <Button onClick={this.showConfirm}>Show confirm</Button>
              <Button onClick={this.showWithAnotherText}>Show another message</Button>
            </div>
          );
        }
       }

 render(<ConfirmDemo/>, document.getElementById('confirm'));
 </file>
 </example>
 */

const containerElement = document.createElement('div');

/**
 * Renders Confirm into virtual node to skip mantaining container
 */
function renderConfirm(props) {
  render(<Confirm {...props} />, containerElement);
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
        reject(new Error('Confirm(ring-ui): null exception'));
      }
    };

    renderConfirm(props);
  });
}

export function hideConfirm() {
  renderConfirm({show: false});
}
