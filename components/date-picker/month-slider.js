import React, {PropTypes} from 'react';
import classNames from 'classnames';
import moment from 'moment';

import RingComponent from '../ring-component/ring-component';

import units, {yearLength, linear, dateType} from './consts';

import styles from './date-picker.css';

const YEAR = 12;

export const speed = yearLength / (YEAR * units.cellSize);

export default class MonthSlider extends RingComponent {
  static propTypes = {
    scrollDate: dateType,
    onScroll: PropTypes.func,
    pxToDate: PropTypes.func
  };

  state = {
    dragging: false
  };

  constructor(...attrs) {
    super(...attrs);

    // we bind here so that the reference is always the same
    this.onMouseUp = ::this.onMouseUp;
    this.onMouseMove = ::this.onMouseMove;
  }

  onMouseDown() {
    this.setState({dragging: true});
  }

  onMouseUp() {
    this.setState({dragging: false});
  }

  onMouseMove(e) {
    this.props.onScroll(
      linear(0, this.props.scrollDate, speed).y(e.movementY)
    );
  }

  didUpdate(prevProps, prevState) {
    if (this.state.dragging && !prevState.dragging) {
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
    } else if (!this.state.dragging && prevState.dragging) {
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  render() {
    let year = moment(this.props.scrollDate).
      startOf('day').
      subtract(1, 'year');
    const years = [year];
    for (let i = 0; i < 2; i++) {
      year = year.
        clone().
        add(1, 'year');
      years.push(year);
    }

    const classes = classNames(
      styles.monthSlider,
      {[styles.dragging]: this.state.dragging}
    );

    return (
      <div>
        {years.map(date => (
          <div
            key={+date}
            className={classes}
            style={{
              top: Math.floor(this.props.pxToDate.x(date) - units.cellSize)
            }}
            onMouseDown={::this.onMouseDown}
          />
        ))}
      </div>
    );
  }
}
