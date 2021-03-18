import PropTypes from 'prop-types';
import add from 'date-fns/add';

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

const durationToMillis = duration => +add(0, duration);

export const yearDuration = durationToMillis({years: 1});
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

export const deprecatedPropType = replacement => (props, propName) => {
  if (propName in props) {
    return new Error(`"${propName}" prop is deprecated and will be removed in 4.0. ${replacement} instead. See https://github.com/JetBrains/ring-ui/blob/master/CHANGELOG.md#310 for details`);
  }
  return undefined;
};

export const dateType = PropTypes.oneOfType([
  PropTypes.instanceOf(Date),
  PropTypes.string,
  PropTypes.number
]);

export function parseTime(time) {
  let result = null;
  if (/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    result = time;
  } else if (/^([0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    result = `0${time}`;
  }

  return result;
}
