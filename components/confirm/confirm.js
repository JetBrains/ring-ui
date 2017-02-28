import React, {PureComponent, PropTypes} from 'react';
import Dialog from '../dialog/dialog';
import Button from '../button/button';
import {Content} from '../island/island';
import Panel from '../panel/panel';
import styles from './confirm.css';

/**
 * @name Confirm
 * @category Components
 * @tags 3.0
 * @framework React
 * @constructor
 * @description A component to show confirmation dialog
 * @example-file ./confirm.examples.html
 */

export default class Confirm extends PureComponent {
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
            primary={!cancelIsDefault}
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
            primary={cancelIsDefault}
          >
            {rejectLabel}
          </Button>
        </Panel>
      </Dialog>
    );
  }
}

