import React, {PropTypes} from 'react';
import Dialog from '../dialog/dialog';
import Button from '../button-legacy/button-legacy';
import RingComponent from '../ring-component/ring-component';
import {Content} from '../island/island';
import Panel from '../panel/panel';
import styles from './confirm.css';

/**
 * @name Confirm
 * @category Components
 * @framework React
 * @constructor
 * @description A component to show confirmation dialog
 * @example
   <example name="confirm">
     <file name="index.html">
       <div id="confirm"></div>
     </file>

     <file name="index.js">
       import {render} from 'react-dom';
       import React from 'react';
       import Confirm from 'ring-ui/components/confirm/confirm';
       import Button from 'ring-ui/components/button-legacy/button-legacy';

       class ConfirmDemo extends React.Component {

        componentDidMount() {
          this.showConfirm();
        }

        showConfirm = () => {
          this.refs.confirm.show().
            then(() => console.info('Confirmed')).
            catch(() => console.warn('Rejected'));
        }

        showWithAnotherText = () => {
          this.refs.confirm.show('There is another question', 'Yes', 'No');
        }

        render() {
          return (
          <div>
            <div>
              <Button onClick={this.showConfirm}>Show confirm</Button>
            </div>
            <div>
              <Button onClick={this.showWithAnotherText}>Show another message</Button>
            </div>
            <Confirm
              ref="confirm"
              text="Do you really want to proceed?"
              confirmText="OK, continue"
              cancelText="No, cancel"
            />
          </div>
          );
        }
       }

       render(<ConfirmDemo/>, document.getElementById('confirm'));
     </file>
   </example>
 */

export default class Confirm extends RingComponent {
  static propTypes = {
    className: PropTypes.string,
    text: PropTypes.string,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string
  };

  defaultProps = {
    confirmText: 'OK',
    cancelText: 'Cancel'
  }

  state = {
    show: false,
    text: null
  };

  resetConfirm() {
    this.setState({
      show: false,
      confirmText: null,
      cancelText: null
    });
    this.resolve = null;
    this.reject = null;
  }

  show(text = this.props.text, confirmText = this.props.confirmText, cancelText = this.props.cancelText) {
    return new Promise((resolve, reject) => {
      this.setState({show: true, text, confirmText, cancelText});
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  confirm = () => {
    this.resolve();
    this.resetConfirm();
  }

  cancel = () => {
    this.reject();
    this.resetConfirm();
  }

  render() {
    const {text, confirmText, cancelText} = this.state;

    return (
      <Dialog
        className={this.props.className}
        show={this.state.show}
      >
        <Content className={styles.text}>{text}</Content>
        <Panel>
          <Button
            blue={true}
            onClick={this.confirm}
          >
            {confirmText}
          </Button>
          <Button onClick={this.cancel}>
            {cancelText}
          </Button>
        </Panel>
      </Dialog>
    );
  }
}

