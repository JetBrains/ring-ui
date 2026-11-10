import {type ReactNode} from 'react';

import styles from '../qodana-cloud.css';

export interface QodanaPageShellProps {
  children: ReactNode;
  'data-test'?: string;
}

export function QodanaPageShell({children, 'data-test': dataTest}: QodanaPageShellProps) {
  return (
    <div className={styles.qodanaPage} data-test={dataTest}>
      {children}
    </div>
  );
}
