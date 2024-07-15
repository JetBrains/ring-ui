import {HTMLAttributes} from 'react';
import classNames from 'classnames';

import styles from './control-help.css';

type ControlHelpProps = HTMLAttributes<HTMLDivElement>
export default function ControlHelp({className, ...restProps}: ControlHelpProps) {
  return <div className={classNames(className, styles.help)} {...restProps}/>;
}
