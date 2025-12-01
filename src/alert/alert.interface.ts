import type Theme from '../global/theme';
import type {ReactNode} from 'react';

/**
 * List of available alert types.
 * @enum {string}
 */
export enum AlertType {
  ERROR = 'error',
  MESSAGE = 'message',
  SUCCESS = 'success',
  WARNING = 'warning',
  LOADING = 'loading',
}

export interface AlertProps {
  theme: Theme;
  timeout: number;
  /**
   * Fires when alert starts closing if timeout is out or user clicks "Close" button
   */
  onCloseRequest: (event?: React.MouseEvent<HTMLElement>) => void;
  onClose: () => void;
  isShaking: boolean;
  isClosing: boolean;
  /**
   * Whether an alert is rendered inside an **Alerts** container
   * or standalone.
   */
  inline: boolean;
  showWithAnimation: boolean;
  closeable: boolean;
  type: AlertType;
  children?: ReactNode;
  className?: string | null | undefined;
  captionClassName?: string | null | undefined;
  closeButtonClassName?: string | null | undefined;
  'data-test'?: string | null | undefined;
}
