import React, {PropTypes} from 'react';
import Dialog from '../dialog/dialog';
import Button from '../button/button';
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
 * @example-file ./confirm.examples.html
 */

export default class Confirm extends RingComponent {
  static propTypes = {
    className: PropTypes.string,
    text: PropTypes.string,
    description: PropTypes.string,

    confirmText: PropTypes.string,
    rejectText: PropTypes.string,

    onConfirm: PropTypes.func,
    onReject: PropTypes.func
  };

  defaultProps = {
    text: null,
    description: null,
    confirmText: 'OK',
    rejectText: 'Cancel',
    onConfirm: () => {},
    onReject: () => {}
  }

  render() {
    const {show, text, description, confirmText, rejectText, onConfirm, onReject} = this.props;

    return (
      <Dialog
        className={this.props.className}
        show={show}
      >
        <Content>
          <div className={styles.text}>{text}</div>
          {description && <div className={styles.description}>{description}</div>}
        </Content>
        <Panel>
          <Button
            data-test="confirm-ok-button"
            blue={true}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
          <Button
            data-test="confirm-reject-button"
            onClick={onReject}
          >
            {rejectText}
          </Button>
        </Panel>
      </Dialog>
    );
  }
}

