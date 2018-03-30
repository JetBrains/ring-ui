import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Input from '../input/input';
import './password.scss';

/**
 * @name Password
 * @category Components
 * @tags Ring UI Language
 * @framework React
 * @constructor
 * @description Input for password with ability to show password strength.
 * @example-file ./password.examples.html
 */

export const isStringEmpty = value => {
  const valueType = typeof value;

  switch (valueType) {
    case 'string':
      return value === '';
    case 'number':
      return false;
    default:
      return true;
  }
};

export default class Password extends PureComponent {
  static propTypes = {
    value: PropTypes.string,
    className: PropTypes.string,
    message: PropTypes.string,
    description: PropTypes.string,
    requiredStrength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    currentStrength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    forceValid: PropTypes.bool
  };

  static defaultProps = {
    requiredStrength: 0,
    currentStrength: 0
  };

  render() {
    const {
      value,
      className,
      requiredStrength, currentStrength,
      message,
      description,
      forceValid,
      ...restProps
    } = this.props;

    const required = +requiredStrength;
    const current = +currentStrength;

    const valid = current > required;
    const markerColorize = current >= required;

    const getValidClasses = (baseClass, applyColors = true) => classNames(baseClass, {
      [`${baseClass}_valid`]: ((valid && required) || forceValid) && applyColors,
      [`${baseClass}_invalid`]: !valid && required && applyColors
    });

    return (
      <div
        data-test="ring-password"
        className={className}
      >
        <Input
          type={'password'}
          rows={1}
          value={value}
          {...restProps}
        />

        <div className={'ring-password'}>
          {!!required && <div className={getValidClasses('ring-password__marker', markerColorize)} style={{left: `${required}%`}}/>}
          <div className={getValidClasses('ring-password__progress')} style={{width: `${current}%`}}/>
        </div>

        {Boolean(message) && !isStringEmpty(value) &&
          <div className={getValidClasses('ring-password__message')}>{message}</div>
        }

        {Boolean(description) &&
          <div className={getValidClasses('ring-password__description')}>{description}</div>
        }
      </div>
    );
  }
}
