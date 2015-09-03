/**
 * @fileoverview ContentEditable component
 */

import React from 'react';
import RingComponent from 'ring-component/ring-component';
import factory from 'factory-decorator/factory-decorator';

/**
 * @name ContentEditable
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="ContentEditable">
     <file name="index.html">
       <div id='contenteditable'></div>
     </file>

     <file name="index.js" webpack="true">
       require('input/input.scss');

       var render = require('react-dom').render;
       var ContentEditable = require('contenteditable/contenteditable');

       render(ContentEditable.factory({
         className: 'ring-input',
         dangerousHTML: 'text <b>bold text</b> text'}
        ), document.getElementById('contenteditable'));
     </file>
   </example>
 */
@factory
export default class ContentEditable extends RingComponent {
  /** @override */
  static propTypes = {
    dangerousHTML: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    componentDidUpdate: React.PropTypes.func
  };

  static defaultProps = {
    dangerousHTML: '',
    disabled: false,
    onComponentUpdate: function() {}
  };

  componentDidUpdate(prevProps, prevState) {
    this.props.onComponentUpdate(prevProps, prevState);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.disabled !== this.props.disabled ||
      nextProps.dangerousHTML !== this.props.dangerousHTML;
  }

  render() {
    return (
      <div {...this.props} contentEditable={!this.props.disabled}
           dangerouslySetInnerHTML={{__html: this.props.dangerousHTML || ''}}></div>
    );
  }
}
