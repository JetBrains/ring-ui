import classNames from 'classnames';

import Heading, {type HeadingProps, Levels} from '../heading/heading';

import styles from './alert.css';

export interface AlertHeadingProps extends HeadingProps {}

export default function AlertHeading({level = Levels.H3, className, ...restProps}: AlertHeadingProps) {
  return <Heading level={level} className={classNames(styles.heading, className)} {...restProps} />;
}
