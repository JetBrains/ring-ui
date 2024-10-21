import {Component, HTMLAttributes} from 'react';
import classNames from 'classnames';

import {interpolateLinear} from '../global/linear-function';

import styles from './island.css';
import {PhaseContext} from './adaptive-island-hoc';

const Start = {
  FONT_SIZE: 24,
  LINE_HEIGHT: 28,
  PADDING_TOP: 24,
  PADDING_BOTTOM: 0,
  X: 0,
  Y: 0,
  SPACING: 0,
};

const End = {
  FONT_SIZE: 13,
  LINE_HEIGHT: 20,
  PADDING_TOP: 16,
  PADDING_BOTTOM: 8,

  // Compensation
  X: 0.4,
  Y: 0.1,
  SPACING: 1.09,
};

const BORDER_APPEAR_PHASE = 0.5;

export interface IslandHeaderProps extends HTMLAttributes<HTMLElement> {
  wrapWithTitle?: boolean | undefined;
  border?: boolean | null | undefined;
  phase?: number | undefined;
}

class Header extends Component<IslandHeaderProps> {
  static defaultProps = {
    wrapWithTitle: true,
  };

  style(name: keyof typeof Start) {
    return interpolateLinear(Start[name], End[name], this.props.phase ?? 0);
  }

  render() {
    const {children, className, wrapWithTitle, border, phase, ...restProps} = this.props;
    const classes = classNames(styles.header, className, {
      [styles.withBottomBorder]: border || (phase != null && phase >= BORDER_APPEAR_PHASE),
    });

    const headerStyle =
      phase != null
        ? {
            lineHeight: `${this.style('LINE_HEIGHT')}px`, // need to append px because number is a valid line-height value
            paddingTop: this.style('PADDING_TOP'),
            paddingBottom: this.style('PADDING_BOTTOM'),
          }
        : undefined;

    const scaleFont = phase != null && this.style('FONT_SIZE') / Start.FONT_SIZE;

    const titleStyle =
      phase != null && phase < 1
        ? {
            fontSize: Start.FONT_SIZE,
            transform: `translate(${this.style('X')}px, ${this.style('Y')}px) scale(${scaleFont})`,
            letterSpacing: this.style('SPACING'),
          }
        : undefined;

    return (
      <div {...restProps} data-test="ring-island-header" className={classes} style={headerStyle}>
        {wrapWithTitle && (
          <h2 className={styles.title} style={titleStyle}>
            {children}
          </h2>
        )}

        {!wrapWithTitle && children}
      </div>
    );
  }
}

const HeaderWrapper = (props: IslandHeaderProps) => (
  <PhaseContext.Consumer>
    {phase => {
      const addProps = phase != null ? {phase} : {};
      return <Header {...props} {...addProps} />;
    }}
  </PhaseContext.Consumer>
);

export default HeaderWrapper;
