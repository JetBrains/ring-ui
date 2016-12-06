import Confirm from '../confirm/confirm';
import {render} from 'react-dom';
import React from 'react';

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
          return confirm('Do you really want to proceed?').
            then(() => console.info('Confirmed')).
            catch(() => console.warn('Rejected'));
        }

        showWithAnotherText = () => {
          return confirm('There is another confirmation', 'Confirmation description', 'OK, confirm this', 'NO, cancel!').
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
  render(<Confirm {...props}/>, containerElement);
}

export default function confirm(text, description, confirmText = 'OK', rejectText = 'Cancel') {
  return new Promise((resolve, reject) => {
    renderConfirm({
      show: true,
      text,
      description,
      confirmText,
      rejectText,
      onConfirm: () => {
        renderConfirm({show: false});
        resolve();
      },
      onReject: () => {
        renderConfirm({show: false});
        reject();
      }
    });
  });
}

export function hideConfirm() {
  renderConfirm({show: false});
}
