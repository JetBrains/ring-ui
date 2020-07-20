import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import deprecate from 'util-deprecate';

import styles from './heading.css';

/**
 * @name Heading
 */

const Levels = {
  H1: 1,
  H2: 2,
  H3: 3,
  H4: 4
};

const fallbackHeading = deprecate(
  () => 'h3',
  'Headings of level 5 and higher are replaced with h3'
);

export default class Heading extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    level: PropTypes.number
  };

  static defaultProps = {
    level: Levels.H1
  };

  static Levels = Levels;

  render() {
    const {children, className, level, ...restProps} = this.props;
    const classes = classNames(styles.heading, className);

    const Tag = level <= Levels.H4 ? `h${level}` : fallbackHeading();

    return (
      <Tag
        {...restProps}
        className={classes}
      >
        {children}
      </Tag>
    );
  }
}

function makeHeading(level, useCaps) {
  return class H extends PureComponent { //eslint-disable-line react/no-multi-comp
    static propTypes = {
      children: PropTypes.node,
      className: PropTypes.string,
      // use only for short h1 headers, no longer than three words
      caps: PropTypes.bool
    };

    render() {
      const {className, caps, ...restProps} = this.props;

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
    }
  };
}

const H1 = makeHeading(Levels.H1, true);
const H2 = makeHeading(Levels.H2);
const H3 = makeHeading(Levels.H3);
const H4 = makeHeading(Levels.H4);

export {H1, H2, H3, H4};
