import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import './input.scss';

/**
 * @name Input
 * @category Forms
 * @constructor
 * @extends {ReactComponent}
 * @example-file ./input__examples.html
 */
export default class Input extends RingComponent {
  static propTypes = {
    multiline: PropTypes.bool,
    className: PropTypes.string
  }

  render() {
    const {className, multiline, shortcuts, ...props} = this.props; // eslint-disable-line no-unused-vars
    const classes = classNames('ring-input', className);

    return multiline ? (
      <textarea
        {...props}
        className={classes}
      />
    ) : (
      <input
        {...props}
        className={classes}
      />
    );
  }
}
