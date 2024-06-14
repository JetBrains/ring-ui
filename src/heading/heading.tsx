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

export interface H1Props extends HTMLAttributes<HTMLHeadingElement> {
  caps?: boolean | null | undefined
}
function makeHeading(level: Levels.H1, useCaps: true): ComponentType<H1Props>
function makeHeading(level: Levels): ComponentType<HTMLAttributes<HTMLHeadingElement>>
function makeHeading(level: Levels, useCaps?: true) {
  const H: ComponentType<H1Props> = memo(({className, caps, ...restProps}: H1Props) => {
    const classes = classNames(className, {
      [styles.caps]: useCaps && caps
    });

    return (
      <Heading
        {...restProps}
        level={level}
        className={classes}
      />
    );
  });
  H.displayName = `H${level}`;
  H.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    // use only for short h1 headers, no longer than three words
    caps: PropTypes.bool
  };
  return H;
}

const H1 = makeHeading(Levels.H1, true);
const H2 = makeHeading(Levels.H2);
const H3 = makeHeading(Levels.H3);
const H4 = makeHeading(Levels.H4);

export {H1, H2, H3, H4};
