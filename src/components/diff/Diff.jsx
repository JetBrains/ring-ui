/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var BaseDiff = require('./BaseDiff');
var Tools = require('./Tools');
var ReactPropTypes = React.PropTypes;

require('./diff.scss');

var DiffMode = BaseDiff.Mode;

var DiffFactory = Tools.createObject(
  DiffMode.SINGLE_PANE, BaseDiff.SinglePane,
  DiffMode.DOUBLE_PANE, BaseDiff.DoublePane,
  DiffMode.PLAIN_FILE, BaseDiff.Plain
);

var Diff = React.createClass({
  statics: {
    Mode: DiffMode
  },
  propTypes: {
    originalContent: ReactPropTypes.string.isRequired,
    modifiedContent: ReactPropTypes.string.isRequired,
    diff: ReactPropTypes.array.isRequired,
    mode: ReactPropTypes.number
  },
  getDefaultProps: function () {
    return {
      mode: DiffMode.SINGLE_PANE
    };
  },
  getCurrentMode: function () {
    return this.props.mode;
  },
  componentDidMount: function () {
    this.diff_ = DiffFactory[this.getCurrentMode()](
      this.getDOMNode(),
      this.props.originalContent,
      this.props.modifiedContent,
      this.props.diff
    );
  },
  componentWillUnmount: function () {
    this.diff_.dispose();
  },
  render: function () {
    var mode = this.getCurrentMode();

    if (mode === DiffMode.PLAIN_FILE || mode === DiffMode.SINGLE_PANE) {
      return this.transferPropsTo(React.DOM.div({
        className: 'ring-diff'
      }));
    }

    /* jshint ignore:start */
    return this.transferPropsTo(
      <div className="ring-diff ring-diff_doublepane">

        <div className="ring-diff__menu">
          <div className="ring-btn-group ring-diff__menu-group">
            <button className="ring-btn ring-diff__menu-btn_up">
              <span className="ring-font-icon ring-font-icon_caret-up">
              </span>
            </button>
            <button className="ring-btn ring-diff__menu-btn_down">
              <span className="ring-font-icon ring-font-icon_caret-down">
              </span>
            </button>
          </div>

          <div className="ring-diff__menu-group">
            <label className="ring-diff__menu-checkbox">
              <input type="checkbox" className="ring-diff__menu-whitespaces"/>
            &nbsp;Ignore whitespaces
            </label>
          </div>
        </div>

        <div className="ring-diff__map"></div>

        <div className="ring-diff__code">
          <div className="ring-diff__original"></div>
          <div className="ring-diff__split">
          </div>
          <div className="ring-diff__modified"></div>
        </div>

      </div>
    );
    /* jshint ignore:end */
  }
});

module.exports = Diff;
