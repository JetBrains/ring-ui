import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '../dialog/dialog';
import Button from '../button/button';
import RingComponent from '../ring-component/ring-component';
import {Content, Header} from '../island/island';
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
    rejectOnEsc: PropTypes.bool,
    inProgress: PropTypes.bool,
    cancelIsDefault: PropTypes.bool,
    confirmLabel: PropTypes.string,
    rejectLabel: PropTypes.string,

    onConfirm: PropTypes.func,
    onReject: PropTypes.func
  };

  static defaultProps = {
    text: null,
    description: null,
    show: false,
    rejectOnEsc: true,
    inProgress: false,
    cancelIsDefault: false,
    confirmLabel: 'OK',
    rejectLabel: 'Cancel',
    onConfirm: () => {},
    onReject: () => {}
  }

  onEscPress = () => {
    if (this.props.rejectOnEsc) {
      this.props.onReject();
    }
  }

  render() {
    const {show, className, inProgress, cancelIsDefault, text, description, confirmLabel, rejectLabel, onConfirm, onReject} = this.props;

    return (
      <Dialog
        className={className}
        onEscPress={this.onEscPress}
        show={show}
      >
        {text && <Header>{text}</Header>}
        <Content>
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

