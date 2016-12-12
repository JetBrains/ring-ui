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
 * @example-file ./confirm.examples.html
 */

export default class Confirm extends RingComponent {
  static propTypes = {
    className: PropTypes.string,
    text: PropTypes.string,
    description: PropTypes.string,

    show: PropTypes.bool,
    inProgress: PropTypes.bool,
    cancelIsDefault: PropTypes.bool,
    confirmLabel: PropTypes.string,
    rejectLabel: PropTypes.string,

    onConfirm: PropTypes.func,
    onReject: PropTypes.func
  };

  defaultProps = {
    text: null,
    description: null,
    show: false,
    inProgress: false,
    cancelIsDefault: false,
    confirmLabel: 'OK',
    rejectLabel: 'Cancel',
    onConfirm: () => {},
    onReject: () => {}
  }

  render() {
    const {show, inProgress, cancelIsDefault, text, description, confirmLabel, rejectLabel, onConfirm, onReject} = this.props;

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
            blue={!cancelIsDefault}
            loader={inProgress}
            disabled={inProgress}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
          <Button
            data-test="confirm-reject-button"
            onClick={onReject}
            disabled={inProgress}
            blue={cancelIsDefault}
          >
            {rejectLabel}
          </Button>
        </Panel>
      </Dialog>
    );
  }
}

