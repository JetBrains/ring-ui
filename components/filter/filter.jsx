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
      value: '',      // set default value
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
    if (!(this.props.regexp && !this.props.regexp.test(value)) &&
      !(this.props.minlength && value.length < +this.props.minlength)) {
      this.props.onFilter(value);
    }
  },

  focus: function() {
    this.getDOMNode().focus();
  },

  reset: function() {
    if (this.props.value) {
      this.getDOMNode().value = this.props.value;
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

    return (<Input className={cs} placeholder={this.props.placeholder} onInput={this.onFilter} />);
  }
});

module.exports = Filter;
