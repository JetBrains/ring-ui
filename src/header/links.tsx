import {HTMLAttributes} from 'react';
import classNames from 'classnames';

import ScrollableSection from '../scrollable-section/scrollable-section';

import styles from './header.css';

// currently only supports vertical header
export default function Links({className, ...restProps}: HTMLAttributes<HTMLDivElement>) {
  return <ScrollableSection {...restProps} className={classNames(styles.links, className)} />;
}
