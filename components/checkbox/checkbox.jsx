import React, { PropTypes } from 'react';
import classNames from 'classnames';
import RingComponent from 'ring-component/ring-component';
import Global from 'global/global';
import Icon from 'icon/icon';
import NgModelMixin from 'ngmodel/ngmodel';

import './checkbox.scss';

/**
 * @const
 * @type {string}
 */
const ID_PREFIX = '\\x0';

const generateUniqueId = Global.getUIDGenerator(ID_PREFIX);

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
   var checkbox = require('checkbox/checkbox.jsx').factory;

   render(checkbox(), document.getElementById('checkbox'));

   render(checkbox({
     checked: true
   }), document.getElementById('checkbox-selected'));

   render(checkbox({
     checked: true
   }), document.getElementById('checkbox-selected'));

   render(checkbox({
     checked: true,
     disabled: true,
     label: 'This checkbox is disabled'
   }), document.getElementById('checkbox-disabled'));

   render(checkbox({
     checked: true,
     label: 'This checkbox is inside div with large line-heigth.'
   }), document.getElementById('checkbox-in-large-line-height-div'));

   render(checkbox({
     checked: true,
     label: 'This checkbox is inside div with small line-heigth.'
   }), document.getElementById('checkbox-in-small-line-height-div'));

   render(checkbox({
     checked: true,
     label: 'This checkbox is inside div with large font-size.'
   }), document.getElementById('checkbox-in-large-font-div'));

   render(checkbox({
     checked: true,
     label: 'This checkbox is inside div with small font-size.'
   }), document.getElementById('checkbox-in-small-font-div'));
   </file>
   </example>
 */

const ngModelStateField = 'checked';

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

  mixins = [NgModelMixin];

  ngModelStateField = ngModelStateField;

  state = {
    id: generateUniqueId(),
    checked: this.props.checked,
    disabled: this.props.disabled
  };

  componentWillReceiveProps(props) {
    if (props.checked !== undefined) {
      this.state.checked = !!props.checked;
    }

    if (props.disabled !== undefined) {
      this.state.disabled = !!props.disabled;
    }
  }

  /**
   * Return native input node
   * @return {HTMLElement}
   */
  getInputDOMNode() {
    return this.refs.input;
  }

  inputChange(e) {
    this.setState({
      checked: e.target.checked
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
            <Icon glyph="check" color="black" size={Icon.Size.Size16} className="ring-checkbox__icon__image" style={checkStyle} />
          </span>
        </span>
        <span className="ring-checkbox__label">{this.props.label}</span>
      </label>
    );
  }
}
