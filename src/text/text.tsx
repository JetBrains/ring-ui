import {Component, HTMLAttributes} from 'react';
import classNames from 'classnames';

import styles from './text.css';

const TextSizes = {
  S: 's',
  M: 'm',
  L: 'l',
} as const;

type TextSize = (typeof TextSizes)[keyof typeof TextSizes];

export interface TextProps extends HTMLAttributes<HTMLElement> {
  info?: boolean | null | undefined;
  size?: TextSize;
  'data-test'?: string | null | undefined;
  bold?: boolean | null | undefined;
}

/**
 * @name Text
 */

export default class Text extends Component<TextProps> {
  static defaultProps = {
    size: TextSizes.M,
  };

  static Size = TextSizes;

  render() {
    const {children, className, info, size, bold, ...restProps} = this.props;

    const classes = classNames(styles.text, className, {
      [styles.info]: info,
      [styles.bold]: bold,
      [styles.sizeS]: size === Text.Size.S,
      [styles.sizeM]: size === Text.Size.M,
      [styles.sizeL]: size === Text.Size.L,
    });

    return (
      <span className={classes} {...restProps}>
        {children}
      </span>
    );
  }
}
