import {PropTypes} from 'react';
import moment from 'moment';

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
