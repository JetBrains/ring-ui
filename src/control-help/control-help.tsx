import {type HTMLAttributes} from 'react';
import classNames from 'classnames';

import styles from './control-help.css';

type ControlHelpProps = HTMLAttributes<HTMLDivElement>;

/**
 * @deprecated Will be removed in Ring UI 9.0. No longer maintained; implement your own solution if needed.
 */
export default function ControlHelp({className, ...restProps}: ControlHelpProps) {
  return <div className={classNames(className, styles.help)} {...restProps} />;
}
