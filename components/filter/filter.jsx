/**
 * @jsx React.DOM
 */
require('./filter.scss');

var React = require('react');
var Input = require('input/input');

var Filter = React.createClass({
  getDefaultProps: function() {
    return {
      placeholder: '',// placeholder
      initialValue: '',      // set default value
      popup: false,   // use special class fro popup filter

      regexp: null,
      minlength: 0,

      onFilter: function() {}
    };
  },

  componentDidMount: function() {
    this.reset();
  },

  onFilter: function() {
    var value = this.value();

    if (this.props.regexp || this.props.minlength) {

      var result = true;
      result &= !(this.props.minlength && value.length < +this.props.minlength);
      result &= !(this.props.regexp && !this.props.regexp.test(value));
      result && this.props.onFilter(value);
    } else {
      this.props.onFilter(value);
    }
  },

  focus: function() {
    this.getDOMNode().focus();
  },

  reset: function() {
    if (this.props.value) {
      this.getDOMNode().value = this.props.initialValue;
    }
  },

  value: function(setValue) {
    if (setValue === undefined) {
      return this.getDOMNode().value;
    } else {
      this.getDOMNode().value = setValue;
      return true;
    }
  },

  render: function() {
    var cs = React.addons.classSet({
      'ring-js-shortcuts': true,
      'ring-filter': true,
      'ring-filter_popup': this.props.popup
    });

    return this.transferPropsTo(<Input className={cs} onInput={this.onFilter}/>);
  }
});

module.exports = Filter;
