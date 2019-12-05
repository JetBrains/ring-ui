import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {interpolateLinear} from '../global/linear-function';

import styles from './island.css';
import {PhaseContext} from './adaptive-island-hoc';

const Start = {
  FONT_SIZE: 24,
  LINE_HEIGHT: 28,
  PADDING: 16
};

const End = {
  FONT_SIZE: 13,
  LINE_HEIGHT: 28,

  // Compensation
  X: 0.4,
  Y: 0.1,
  SPACING: 1.09
};

const BORDER_APPEAR_PHASE = 0.5;

class Header extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    border: PropTypes.bool,
    wrapWithTitle: PropTypes.bool,
    phase: PropTypes.number
  };

  static defaultProps = {
    wrapWithTitle: true
  };

  style(name) {
    return interpolateLinear(Start[name] || 0, End[name] || 0, this.props.phase);
  }

  render() {
    const {children, className, wrapWithTitle, border, phase, ...restProps} = this.props;
    const classes = classNames(styles.header, className, {
      [styles.withBottomBorder]: border || phase >= BORDER_APPEAR_PHASE
    });


    const headerStyle = phase != null
      ? {
        lineHeight: `${this.style('LINE_HEIGHT')}px`, // need to append px because number is a valid line-height value
        paddingTop: this.style('PADDING')
      }
      : null;

    const scaleFont = phase != null && this.style('FONT_SIZE') / Start.FONT_SIZE;

    const titleStyle = (phase != null && phase < 1)
      ? {
        fontSize: Start.FONT_SIZE,
        transform: `translate(${this.style('X')}px, ${this.style('Y')}px) scale(${scaleFont})`,
        letterSpacing: this.style('SPACING')
      }
      : null;

    return (
      <div
        {...restProps}
        data-test="ring-island-header"
        className={classes}
        style={headerStyle}
      >
        {wrapWithTitle &&
        (
          <div
            className={styles.title}
            style={titleStyle}
          >
            {children}
          </div>
        )}

        {!wrapWithTitle && children}

      </div>
    );
  }
}

const HeaderWrapper = props => (
  <PhaseContext.Consumer>
    {phase => {
      const addProps = phase != null ? {phase} : {};
      return <Header {...props} {...addProps}/>;
    }}
  </PhaseContext.Consumer>
);

export default HeaderWrapper;
