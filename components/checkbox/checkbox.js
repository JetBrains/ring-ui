import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import Icon from '../icon/icon';

import './checkbox.scss';

const ngModelStateField = 'checked';

/**
 * @name Checkbox
 * @category Forms
 * @constructor
 * @extends {ReactComponent}
 * @example-file ./checkbox.examples.html
 */
export default class Checkbox extends RingComponent {
  static ngModelStateField = ngModelStateField;

  static propTypes = {
    name: PropTypes.string,

    /**
     * Add custom class for checkbox
     */
    className: PropTypes.string,

    /**
     * Set component ID. If user does not pass an ID
     * we generate a unique ID for checkbox to work correctly.
     */
    id: PropTypes.string
  };

  ngModelStateField = ngModelStateField;

  state = {
    id: this.constructor.getUID('ring-checkbox-'),
    checked: this.props.checked,
    disabled: this.props.disabled
  };

  willReceiveProps(props) {
    if (props.checked !== undefined) {
      this.state.checked = !!props.checked;
    }

    if (props.disabled !== undefined) {
      this.state.disabled = !!props.disabled;
    }
  }

  inputChange(e) {
    const newValue = e.target.checked;

    this.setState({
      checked: newValue
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(newValue);
      }
    });
  }

  render() {
    const id = this.props.id || this.state.id;
    const {_onModelChange, inputChange, ...restProps} = this.props; // eslint-disable-line no-unused-vars
    const {checked} = this.state;

    const classes = classNames(
      'ring-checkbox__input',
      this.props.className
    );

    return (
      <label
        className="ring-checkbox"
        htmlFor={id}
      >
        <span className="ring-checkbox__input-wrapper">
          <input
            {...restProps}
            ref="input"
            disabled={this.state.disabled}
            onChange={::this.inputChange}
            type="checkbox"
            className={classes}
            id={id}
            checked={Boolean(this.state.checked)}
          />
          <span className="ring-checkbox__icon">
            {checked &&
            <Icon
              className="ring-checkbox__icon__image"
              color="black"
              glyph={require('jetbrains-icons/check.svg')}
              size={Icon.Size.Size18}
            />}
          </span>
        </span>
        <span className="ring-checkbox__label">{this.props.label}</span>
      </label>
    );
  }
}
