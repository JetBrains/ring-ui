import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import './input.scss';

/**
 * @name Input
 * @category Forms
 * @constructor
 * @description Text input fields of varying size.
 * @extends {ReactComponent}
 * @example-file ./input.examples.html
 */
export default class Input extends RingComponent {
  static propTypes = {
    multiline: PropTypes.bool,
    className: PropTypes.string
  }

  render() {
    const {className, inputRef, active, error, material, valid, multiline, shortcuts, ...props} = this.props; // eslint-disable-line no-unused-vars
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
