import React, {PureComponent, PropTypes} from 'react';
import classNames from 'classnames';

import styles from './heading.css';

/**
 * @name Heading
 * @category Components
 * @tags 3.0
 * @framework React
 * @constructor
 * @description Replacement for h1-h5 tags
 * @example
  <example name="heading">
    <file name="index.html">
      <div id="heading"></div>
    </file>
    <file name="index.scss">
      h1, h2, h3 {
        &::after {
          content: 'Heading';
          display: block;
          position: absolute;
          color: #CCC;
          z-index: -1;
        }
      }

      h4, h5 {
        & + div::before {
          content: 'Lorem ipsum';
          display: block;
          position: absolute;
          color: #BBB;
          z-index: -1;
          transform: translateY(-100%);
        }
      }
    </file>
    <file name="index.js">
      import React, {Component} from 'react';
      import {render} from 'react-dom';
      import Heading, {H1, H2, H3, H4, H5} from 'ring-ui/components/heading/heading';
      const container = document.getElementById('heading');
      const lorem = <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div>;
      const demo = (
        <div>
          <Heading level={Heading.Levels.H1}>Heading</Heading>
          {lorem}
          <H1 caps>Heading</H1>
          {lorem}
          <H2>Heading</H2>
          {lorem}
          <H3>Heading</H3>
          {lorem}
          <H4>Heading</H4>
          {lorem}
          <H5>Heading</H5>
          {lorem}
        </div>
      );
      render(demo, container);
    </file>
  </example>
 */

const Levels = {
  H1: 1,
  H2: 2,
  H3: 3,
  H4: 4,
  H5: 5
};

export default class Heading extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    level: PropTypes.number
  };

  static defaultProps = {
    level: Levels.H1
  }

  static Levels = Levels;

  render() {
    const {children, className, level, ...restProps} = this.props;
    const classes = classNames(styles.heading, className);
    const Tag = `h${level}`;

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
const H5 = makeHeading(Levels.H5);

export {H1, H2, H3, H4, H5};
