import PropTypes from 'prop-types';

export const refObject = <T>(value: PropTypes.Validator<T>) => PropTypes.shape({
  current: value
});
