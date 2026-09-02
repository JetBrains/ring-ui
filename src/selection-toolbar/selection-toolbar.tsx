import {forwardRef, type HTMLAttributes, type ReactNode, type Ref, useId} from 'react';
import classNames from 'classnames';

import dataTests from '../global/data-tests';
import Theme, {ThemeProvider} from '../global/theme';

import styles from './selection-toolbar.css';

export interface SelectionToolbarProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  selectAll?: ReactNode;
  closeAction: ReactNode;
  compact?: boolean;
  'data-test'?: string | null;
}

export const SelectionToolbar = forwardRef<HTMLDivElement, SelectionToolbarProps>(function SelectionToolbar(
  {
    label,
    selectAll,
    closeAction,
    compact,
    className,
    children,
    'data-test': dataTest,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...restProps
  },
  ref,
) {
  const labelId = useId();
  const hasSelectAll = selectAll != null;

  return (
    <ThemeProvider
      {...restProps}
      ref={ref as Ref<HTMLElement>}
      theme={Theme.DARK}
      role='group'
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy ?? (ariaLabel == null ? labelId : undefined)}
      data-test={dataTests('ring-selection-toolbar', dataTest)}
      className={classNames(styles.toolbar, {[styles.compact]: compact}, className)}
    >
      <div className={styles.content}>
        <span id={labelId} className={styles.label}>
          {label}
        </span>
        {hasSelectAll && <span className={styles.selectAll}>{selectAll}</span>}
        <div className={styles.actions}>{children}</div>
      </div>
      <div className={styles.closeAction}>{closeAction}</div>
    </ThemeProvider>
  );
});

export function SelectionToolbarSeparator() {
  return <span role='separator' aria-orientation='vertical' className={styles.separator} />;
}

export default SelectionToolbar;
