import {memo, HTMLAttributes, ComponentType} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import deprecate from 'util-deprecate';

import styles from './heading.css';

/**
 * @name Heading
 */

export enum Levels {
  H1 = 1,
  H2 = 2,
  H3 = 3,
  H4 = 4
}

const fallbackHeading = deprecate(
  () => 'h3',
  'Headings of level 5 and higher are replaced with h3'
);

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: Levels | undefined
}

const HeadingMemo: ComponentType<HeadingProps> =
  memo(function Heading({children, className, level = Levels.H1, ...restProps}: HeadingProps) {
    const classes = classNames(styles.heading, className);

    const Tag: 'h1' | 'h2' | 'h3' | 'h4' = level <= Levels.H4 ? `h${level}` : fallbackHeading();

    return (
      <Tag
        {...restProps}
        className={classes}
      >
        {children}
      </Tag>
    );
  });

const Heading = HeadingMemo as ComponentType<HeadingProps> & {Levels: typeof Levels};

Heading.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  level: PropTypes.oneOf([Levels.H1, Levels.H2, Levels.H3, Levels.H4])
};

Heading.Levels = Levels;

export default Heading;

const H1 = memo(function H1(props: HTMLAttributes<HTMLHeadingElement>) {
  return <Heading {...props} level={Levels.H1}/>;
});

const H2 = memo(function H2(props: HTMLAttributes<HTMLHeadingElement>) {
  return <Heading {...props} level={Levels.H2}/>;
});

const H3 = memo(function H3(props: HTMLAttributes<HTMLHeadingElement>) {
  return <Heading {...props} level={Levels.H3}/>;
});

export interface H4Props extends HTMLAttributes<HTMLHeadingElement> {
  bold?: boolean | null | undefined
}
const H4 = memo(function H4({className, bold, ...restProps}: H4Props) {
  const classes = classNames(className, {[styles.bold]: bold});
  return <Heading {...restProps} className={classes} level={Levels.H4}/>;
});

export {H1, H2, H3, H4};
