/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var BaseDiff = require('./diff__base');
var ReactPropTypes = React.PropTypes;

require('./diff.scss');
require('codemirror/lib/codemirror.css');

/**
 * @constructor
 * @extends {ReactComponent}
 */
var Diff = React.createClass({
  statics: {
    Mode: BaseDiff.Mode
  },
  propTypes: {
    originalContent: ReactPropTypes.string.isRequired,
    modifiedContent: ReactPropTypes.string.isRequired,
    diff: ReactPropTypes.array.isRequired,
    mode: ReactPropTypes.number
  },
  getDefaultProps: function () {
    return {
      mode: BaseDiff.Mode.SINGLE_PANE
    };
  },
  getCurrentMode: function () {
    return this.props.mode;
  },
  componentDidMount: function () {
    this.diff_ = new BaseDiff(this.getDOMNode(), this.getCurrentMode());
    this.diff_.setContent(
      this.props.originalContent,
      this.props.modifiedContent,
      this.props.diff
    );
  },
  componentWillUnmount: function () {
    this.diff_.dispose();
  },
  componentWillReceiveProps: function (nextProps) {
    var diffHash = JSON.stringify(nextProps.diff);
    var currentDiffHash = JSON.stringify(this.diff_.getController().getDiff());

    if (diffHash !== currentDiffHash) {
      this.diff_.setContent(
        nextProps.originalContent,
        nextProps.modifiedContent,
        nextProps.diff
      );
    }
  },
  render: function () {
    var mode = this.getCurrentMode();

    if (mode === BaseDiff.Mode.PLAIN_FILE || mode === BaseDiff.Mode.SINGLE_PANE) {
      return this.transferPropsTo(React.DOM.div({
        className: 'ring-diff'
      }));
    }

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
  }
});

module.exports = Diff;
