import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import RingComponent from '../ring-component/ring-component';

import ieCompatibleInputHOC from './ie-compatible-hoc';
import './input.scss';

/**
 * @name Input
 * @category Forms
 * @constructor
 * @description Text input fields of varying size.
 * @extends {ReactComponent}
 * @example-file ./input.examples.html
 */
class Input extends RingComponent {
  static propTypes = {
    multiline: PropTypes.bool,
    className: PropTypes.string,
    inputRef: PropTypes.func,
    active: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    valid: PropTypes.bool,
    material: PropTypes.bool,
    shortcuts: PropTypes.bool
  }

  render() {
    const {className, inputRef, active, error, material, valid, multiline, shortcuts, ...props} = this.props; // eslint-disable-line no-unused-vars, max-len
    const classes = classNames('ring-input', className, {
      'ring-input_active': active,
      'ring-input_correct': valid,
      'ring-input_error': error,
      'ring-input_material': material
    });

    return multiline ? (
      <textarea
        ref={inputRef}
        {...props}
        className={classes}
      />
    ) : (
      <input
        ref={inputRef}
        {...props}
        className={classes}
      />
    );
  }
}

export default ieCompatibleInputHOC(Input);
