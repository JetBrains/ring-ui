import {Component, HTMLAttributes} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './text.css';

type TextSize = 's' | 'm' | 'l';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  info?: boolean | null | undefined,
  size?: TextSize,
  'data-test'?: string | null | undefined
  bold?: boolean | null | undefined
}

const TextSize: Record<string, TextSize> = {
  S: 's',
  M: 'm',
  L: 'l'
};

/**
 * @name Text
 */

export default class Text extends Component<TextProps> {

  static propTypes = {
    children: PropTypes.node,
    info: PropTypes.bool,
    size: PropTypes.oneOf(Object.keys(TextSize).map(it => TextSize[it])),
    className: PropTypes.string
  };

  static Size = TextSize;

  render() {
    const {children, className, info, size, bold, ...restProps} = this.props;

    const classes = classNames(styles.text, className, {
      [styles.info]: info,
      [styles.bold]: bold,
      [styles.sizeS]: size === Text.Size.S,
      [styles.sizeM]: size === Text.Size.M,
      [styles.sizeL]: size === Text.Size.L
    });

    return (
      <span className={classes} {...restProps}>{children}</span>
    );
  }
}
