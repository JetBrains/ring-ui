import React from 'react';
import PropTypes from 'prop-types';

import RingComponent from '../ring-component/ring-component';

import './radio.scss';

export default class Radio extends RingComponent {
  static contextTypes = {
    ringRadioGroup: PropTypes.object
  };

  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    value: PropTypes.string
  };

  constructor(...args) {
    super(...args);
    this.uid = this.constructor.getUID('ring-radio-item-');
  }

  inputRef = el => {
    this.input = el;
  };

  labelRef = el => {
    this.label = el;
  };

  textLabelRef = el => {
    this.textLabel = el;
  };

  render() {
    const {name, value, onChange} = this.context.ringRadioGroup || {};
    const {className, children, ...restProps} = this.props;

    const optional = {};
    if (value !== undefined) {
      optional.checked = (this.props.value === value);
    }
    if (typeof onChange === 'function') {
      optional.onChange = () => onChange(this.props.value);
    }

    return (
      <div className={className}>
        <input
          name={name}
          id={this.uid}
          {...restProps}
          ref={this.inputRef}
          className="ring-radio"
          type="radio"
          {...optional}
        />
        <label
          className="ring-radio__label"
          htmlFor={this.uid}
          ref={this.labelRef}
        />
        <label
          className="ring-radio__text-label"
          htmlFor={this.uid}
          ref={this.textLabelRef}
        >
          {children}
        </label>
      </div>
    );
  }
}

