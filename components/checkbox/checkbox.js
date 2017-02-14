import React, {PureComponent, PropTypes} from 'react';
import classNames from 'classnames';
import Icon from '../icon/icon';

import './checkbox.scss';

/**
 * @name Checkbox
 * @category Forms
 * @constructor
 * @extends {ReactComponent}
 * @example-file ./checkbox.examples.html
 */
export default class Checkbox extends PureComponent {

  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
  };

  state = {
    checked: this.props.checked,
    disabled: this.props.disabled
  };

  componentWillReceiveProps({checked, disabled}) {
    if (checked !== undefined) {
      this.setState({checked});
    }

    if (disabled !== undefined) {
      this.setState({disabled});
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
    const {label: labelProp, ...restProps} = this.props; // eslint-disable-line no-unused-vars
    const {checked, disabled} = this.state;

    const classes = classNames(
      'ring-checkbox__input',
      this.props.className
    );

    return (
      <label className="ring-checkbox">
        <span className="ring-checkbox__input-wrapper">
          <input
            {...restProps}
            ref="input"
            disabled={disabled}
            onChange={::this.inputChange}
            type="checkbox"
            className={classes}
            checked={Boolean(checked)}
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
        <span className="ring-checkbox__label">{labelProp}</span>
      </label>
    );
  }
}
