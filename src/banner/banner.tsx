import React from 'react';
import classnames from 'classnames';
import infoIcon from '@jetbrains/icons/info-filled';
import exceptionIcon from '@jetbrains/icons/exception';
import successIcon from '@jetbrains/icons/success';
import warningIcon from '@jetbrains/icons/warning';
import closeIcon from '@jetbrains/icons/close';

import Icon from '../icon/icon';
import Link from '../link/link';
import Tooltip from '../tooltip/tooltip';

import styles from './banner.css';

export interface BannerTranslations {
  close: string;
}

export interface BannerProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  mode?: 'info' | 'error' | 'success' | 'warning' | 'purple' | 'grey';
  withIcon?: boolean;
  inline?: boolean;
  onClose?: () => void;
  closeButtonTitle?: string;
  className?: string;
  ['data-test']?: string;
  translations?: BannerTranslations;
}

export function Banner(props: BannerProps) {
  const {
    title,
    children,
    mode = 'info',
    withIcon = false,
    inline = false,
    onClose,
    closeButtonTitle,
    className,
    translations = {
      close: 'Close',
    },
  } = props;
  const dataTest = props['data-test'];

  let icon = infoIcon;
  if (mode === 'error') {
    icon = exceptionIcon;
  } else if (mode === 'success') {
    icon = successIcon;
  } else if (mode === 'warning') {
    icon = warningIcon;
  }

  return (
    <div
      className={classnames(
        {
          [styles.banner]: true,
          [styles.inline]: inline,
          [styles.info]: mode === 'info',
          [styles.error]: mode === 'error',
          [styles.success]: mode === 'success',
          [styles.warning]: mode === 'warning',
          [styles.purple]: mode === 'purple',
          [styles.grey]: mode === 'grey',
        },
        className,
      )}
      data-test={dataTest}
    >
      {withIcon && <Icon glyph={icon} className={styles.icon} />}

      <div>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.description}>{children}</div>
      </div>

      {onClose && (
        <Tooltip title={closeButtonTitle ?? translations.close} className={styles.closeButtonWrapper}>
          <Link className={styles.closeButton} pseudo onClick={onClose} aria-label='Close'>
            <Icon glyph={closeIcon} />
          </Link>
        </Tooltip>
      )}
    </div>
  );
}

export default React.memo(Banner);
