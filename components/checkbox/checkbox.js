import React, { PropTypes } from 'react';
import classNames from 'classnames';
import RingComponent from 'ring-component/ring-component';
import Icon from 'icon/icon';

import './checkbox.scss';

const ngModelStateField = 'checked';

/**
 * @name Checkbox
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="Checkbox">
   <file name="index.html">
    <h1>Base Examples</h1>
    <div id="checkbox-base">
      <span id="checkbox"></span>
      <span id="checkbox-selected"></span>
      <span id="checkbox-disabled"></span>
    </div>
    <h1>Examples with outer styles</h1>
    <div id="checkbox-additional">
      <div style="line-height: 60px">
        <span id="checkbox-in-large-line-height-div"></span>
        <span>This text should be aligned on same line with checkbox label</span>
      </div>
      <div style="line-height: 6px;">
        <span id="checkbox-in-small-line-height-div"></span>
        <span>This text should be aligned on same line with checkbox label</span>
      </div>
      <div style="font-size: 40px">
        <span id="checkbox-in-large-font-div"></span>
        <span>This text should be aligned on same line with checkbox label</span>
      </div>
      <div style="line-height: 6px; font-size: 4px">
        <span id="checkbox-in-small-font-div"></span>
        <span>This text should be aligned on same line with checkbox label</span>
      </div>
    </div>
   </file>

   <file name="index.js" webpack="true">
   var render = require('react-dom').render;
   var Checkbox = require('checkbox/checkbox');

   render(Checkbox.factory(), document.getElementById('checkbox'));

   render(Checkbox.factory({
     checked: true
   }), document.getElementById('checkbox-selected'));

   render(Checkbox.factory({
     checked: true
   }), document.getElementById('checkbox-selected'));

   render(Checkbox.factory({
     checked: true,
     disabled: true,
     label: 'This checkbox is disabled'
   }), document.getElementById('checkbox-disabled'));

   render(Checkbox.factory({
     checked: true,
     label: 'This checkbox is inside div with large line-heigth.'
   }), document.getElementById('checkbox-in-large-line-height-div'));

   render(Checkbox.factory({
     checked: true,
     label: 'This checkbox is inside div with small line-heigth.'
   }), document.getElementById('checkbox-in-small-line-height-div'));

   render(Checkbox.factory({
     checked: true,
     label: 'This checkbox is inside div with large font-size.'
   }), document.getElementById('checkbox-in-large-font-div'));

   render(Checkbox.factory({
     checked: true,
     label: 'This checkbox is inside div with small font-size.'
   }), document.getElementById('checkbox-in-small-font-div'));
   </file>
   </example>
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
    id: this.constructor.getUID(),
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
    }, function() {
      if (this.props.onChange) {
        this.props.onChange(newValue);
      }
    });
  }

  render() {
    let id = this.props.id || this.state.id;

    let checkStyle = {
      display: this.state.checked ? 'block' : 'none'
    };

    let disabledState = this.state.disabled ? 'disabled' : '';

    let classes = classNames(
      'ring-checkbox__input',
      this.props.className
    );

    return (
      <label className="ring-checkbox" htmlFor={id}>
        <span className="ring-checkbox__input-wrapper">
          <input
            {...this.props}
            ref="input"
            disabledState
            onChange={::this.inputChange}
            type="checkbox"
            className={classes}
            id={id}
            checked={this.state.checked}
          />
          <span className="ring-checkbox__icon">
            <Icon glyph={require('icon/source/check.svg')} color="black" size={Icon.Size.Size16} className="ring-checkbox__icon__image" style={checkStyle} />
          </span>
        </span>
        <span className="ring-checkbox__label">{this.props.label}</span>
      </label>
    );
  }
}
