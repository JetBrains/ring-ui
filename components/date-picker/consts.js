import {PropTypes} from 'react';
import moment from 'moment';

import styles from './date-picker.css';

/* doesn't work yet
const units = ['unit', 'cellSize', 'calHeight', 'yearHeight'].
  reduce((obj, key) => {
    obj[key] = parseInt(styles[key], 10);
    return obj;
  }, {});*/

const unit = parseInt(styles.unit, 10);

const unitsInCal = 36;
const calHeight = unit * unitsInCal;

const unitsInCell = 3;
const cellSize = unit * unitsInCell;

const unitsInYear = 4;
const yearHeight = unit * unitsInYear;

export default {unit, cellSize, calHeight, yearHeight};

export const yearLength = +moment.duration(1, 'year');

export const weekdays = {
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
  SU: 0
};

export function linear(x0, y0, a) {
  return {
    y(x) {
      return +y0 + (x - x0) * a;
    },

    x(y) {
      return +x0 + (y - y0) / a;
    }
  };
}

export const dateType = PropTypes.oneOfType([
  (props, propName) => {
    if (!moment.isMoment(props[propName])) {
      return new Error(
        `${propName} should be a string, number, Date object or Moment object`
      );
    }
    return undefined;
  },
  PropTypes.instanceOf(Date),
  PropTypes.string,
  PropTypes.number
]);
