import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import addYears from 'date-fns/addYears';
import startOfDay from 'date-fns/startOfDay';
import subYears from 'date-fns/subYears';

import linearFunction from '../global/linear-function';


import units, {dateType, yearScrollSpeed} from './consts';
import styles from './date-picker.css';

const COVERYEARS = 3;

export default class MonthSlider extends PureComponent {
  static propTypes = {
    scrollDate: dateType,
    onScroll: PropTypes.func,
    pxToDate: PropTypes.shape({
      x: PropTypes.func,
      y: PropTypes.func
    })
  };

  state = {
    dragging: false
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.dragging && !prevState.dragging) {
      window.addEventListener('mousemove', this.onMouseMove);
      window.addEventListener('mouseup', this.onMouseUp);
    } else if (!this.state.dragging && prevState.dragging) {
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  onMouseDown = () => {
    this.setState({dragging: true});
  };

  onMouseUp = () => {
    this.setState({dragging: false});
  };

  onMouseMove = e => {
    this.props.onScroll(
      linearFunction(0, this.props.scrollDate, yearScrollSpeed).y(e.movementY)
    );
  };

  render() {
    let year = subYears(startOfDay(this.props.scrollDate), 1);
    const years = [year];
    for (let i = 0; i <= COVERYEARS; i++) {
      year = addYears(year, 1);
      years.push(year);
    }

    const classes = classNames(
      styles.monthSlider,
      {[styles.dragging]: this.state.dragging}
    );

    return (
      <div>
        {years.map(date => (
          <button
            type="button"
            key={+date}
            className={classes}
            style={{
              top: Math.floor(this.props.pxToDate.x(date) - units.cellSize)
            }}
            onMouseDown={this.onMouseDown}
          />
        ))}
      </div>
    );
  }
}
