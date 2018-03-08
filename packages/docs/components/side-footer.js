import React from 'react';
import Link from '@jetbrains/ring-ui/components/link/link';

import styles from './index.css';

const SideFooter = () => {
  const currentYear = (new Date()).getUTCFullYear();

  return (
    <div className={styles.sideFooter}>
      <div className={styles.copyright}>
        Copyright © 2000–{currentYear} JetBrains
      </div>
      <Link
        href="https://raw.githubusercontent.com/JetBrains/ring-ui/master/LICENSE.txt"
        target="_blank"
        title="read me!"
      >License agreement</Link>
    </div>
  );
};
export default SideFooter;
