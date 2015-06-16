/**
 * @fileoverview ContentEditable component
 * @jsx React.DOM
 */

var React = require('react');

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

       var React = require('react');
       var ContentEditable = require('contenteditable/contenteditable');
       var container = document.getElementById('contenteditable');

       React.renderComponent(ContentEditable({
         className: 'ring-input',
         dangerousHTML: 'text <b>bold text</b> text'}), container);
     </file>
   </example>
 */
var ContentEditable = React.createClass({
  /** @override */
  propTypes: {
    dangerousHTML: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    componentDidUpdate: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      dangerousHTML: '',
      disabled: false,
      onComponentUpdate: function() {}
    };
  },

  componentDidUpdate: function (prevProps, prevState) {
    this.props.onComponentUpdate(prevProps, prevState);
  },

  shouldComponentUpdate: function (nextProps) {
    return nextProps.disabled !== this.props.disabled ||
      nextProps.dangerousHTML !== this.props.dangerousHTML;
  },

  render: function () {
    return this.transferPropsTo(
      <div contentEditable={!this.props.disabled}
           dangerouslySetInnerHTML={{__html: this.props.dangerousHTML || ''}}></div>
    );
  }
});

module.exports = ContentEditable;
