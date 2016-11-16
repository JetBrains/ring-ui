import {PropTypes} from 'react';
import moment from 'moment';

import formats from './formats';

import styles from './date-picker.css';

const units = ['unit', 'cellSize', 'calHeight', 'yearHeight'].
  reduce((obj, key) => {
    obj[key] = parseInt(styles[key], 10);
    return obj;
  }, {});

export default units;

export const yearDuration = +moment.duration(1, 'year');

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

export function scheduleRAF() {
  let scheduledCb;
  let RAF;
  return function schedule(cb) {
    scheduledCb = cb;
    if (!RAF) {
      RAF = window.requestAnimationFrame(() => {
        scheduledCb();
        RAF = null;
        scheduledCb = null;
      });
    }
  };
}

const parsed = Object.create(null);
export function parseDate(text, ...addFormats) {
  if (typeof text === 'number') {
    return moment(text);
  }

  const key = `${text}__${addFormats.join('__')}`;
  if (!(key in parsed)) {
    const extendedFormats = [
      ...addFormats,
      ...formats
    ];
    const date = moment(text, extendedFormats);
    parsed[key] = date.isValid() ? date : null;
  }

  return parsed[key];
}

