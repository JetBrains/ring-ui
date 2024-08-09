import {PureComponent, ReactNode} from 'react';
import * as React from 'react';

import Dialog from '../dialog/dialog';
import Button from '../button/button';
import {Content, Header} from '../island/island';
import Panel from '../panel/panel';

import styles from './confirm.css';

export interface ConfirmProps {
  text: string
  description: ReactNode
  show: boolean
  rejectOnEsc: boolean
  inProgress: boolean
  cancelIsDefault: boolean
  confirmLabel: string
  rejectLabel: string
  onConfirm: ((event: React.MouseEvent<HTMLButtonElement>) => void)
  onReject: ((event?: React.MouseEvent<HTMLButtonElement>) => void)
  className?: string | undefined
  native?: boolean
}

/**
 * @name Confirm
 */

export default class Confirm extends PureComponent<ConfirmProps> {
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
  };

  onEscPress = () => {
    if (this.props.rejectOnEsc) {
      this.props.onReject();
    }
  };

  render() {
    const {
      show,
      className,
      inProgress,
      cancelIsDefault,
      text,
      description,
      confirmLabel,
      rejectLabel,
      onConfirm,
      onReject,
      native
    } = this.props;

    return (
      <Dialog
        label={text || (typeof description === 'string' ? description : undefined)}
        className={className}
        onEscPress={this.onEscPress}
        show={show}
        trapFocus
        data-test="ring-confirm"
        native={native}
      >
        {text && <Header>{text}</Header>}
        {description && (
          <Content>
            <div className={styles.description}>{description}</div>
          </Content>
        )}
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

export type ConfirmAttributes = JSX.LibraryManagedAttributes<typeof Confirm, ConfirmProps>
