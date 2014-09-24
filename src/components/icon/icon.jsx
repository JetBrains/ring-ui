/**
 * @fileoverview svg icon component
 * @author igor.alexeenko@jetbrains.com (Igor Alekseenko)
 * @author alexander.anisimov@jetbrains.com (Alexander Anisimov)
 * @jsx React.DOM
 */

'use strict';

require('./icon.scss');
/*jshint ignore:start*/
var Global = require('global/global');
/*jshint ignore:end*/
var React = require('react');

/**
 * @enum {number}
 */
var Size = {
  16: 16,
  32: 32,
  64: 64,
  128: 128
};

/**
 * @constructor
 * @extends {ReactComponent}
 * @example
 * <example>
 *   <div class="icon-container"></div>
 *
 *   <script>
 *     var Icon = require('icon');
 *
 *     React.renderComponent(<Icon className="additional-class" modifier="ok" size={Icon.Size['32']} />,
 *         document.querySelector('.icon-container'));
 *   </script>
 * </example>
 */
var Icon = React.createClass({
  statics: {
    Size: Size
  },

  propTypes: {
    className: React.PropTypes.string,
    modifier: React.PropTypes.string,
    size: React.PropTypes.number
  },

  getDefaultProps: function () {
    return {
      className: '',
      modifier: '',
      size: Size['32']
    };
  },

  render: function () {
    /* jshint ignore:start */
    var classList = React.addons.classSet(Global.createObject(
        'ring-icon', true,
        'ring-icon_' + this.props.size, true,
        'ring-icon_' + this.props.modifier, !!this.props.modifier));

    return (<span className={classList} />);
    /* jshint ignore:end */
  }
});

/** @type {Icon} */
module.exports = Icon;
