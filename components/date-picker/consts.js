import PropTypes from 'prop-types';
import moment from 'moment';

import formats from './formats';

const unit = 8; // px;
const units = {
  unit,
  /* eslint-disable no-magic-numbers */
  cellSize: unit * 3,
  calHeight: unit * 36,
  yearHeight: unit * 4
  /* eslint-enable */
};

export default units;

export const YEAR = 12;
export const WEEK = 7;
export const weekdays = {
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
  SU: 0
};
export const MIDDLE_DAY = 15;

export const yearDuration = +moment.duration(1, 'year');
export const yearScrollSpeed = yearDuration / (YEAR * units.cellSize);

export const DOUBLE = 2;
export const HALF = 0.5;

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

const parsed = Object.create(null);
export function parseDate(text, ...addFormats) {
  let date;
  if (typeof text !== 'string') {
    date = moment(text);
  } else {

    const key = `${text}__${addFormats.join('__')}`;
    if (!(key in parsed)) {
      const extendedFormats = [
        ...addFormats,
        ...formats
      ];
      parsed[key] = moment(text, extendedFormats);
    }

    date = parsed[key];
  }
  return date.isValid() ? date : null;
}

export function parseTime(time) {
  let result = null;
  if (/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    result = time;
  } else if (/^([0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    result = `0${time}`;
  }

  return result;
}
