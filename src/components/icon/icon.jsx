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
  Size16: 16,
  Size32: 32,
  Size64: 64,
  Size128: 128
};


/**
 * @type {Element}
 * @private
 */
var _templateElement = null;


/**
 * Inserts an {@link Element} which contains all paths of icons, which might
 * be used. Icons are insterted by tag <use xlink:href /> which is linked to
 * path of needed icon.
 * @private
 */
var _initializeTemplate = function() {
  _templateElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  _templateElement.style.display = 'none';
  _templateElement.setAttributeNS(null, 'viewBox', '0 0 0 0');
  _templateElement.innerHTML = require('./icon__template');

  // NB! Template svg should be a first node in document.
  // https://code.google.com/p/chromium/issues/detail?id=349175
  document.body.insertBefore(_templateElement, document.body.childNodes[0]);
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
      size: Size.Size64
    };
  },

  render: function () {
    /* jshint ignore:start */
    var classList = React.addons.classSet(Global.createObject(
        'ring-icon', true,
        'ring-icon_' + this.props.size, true,
        'ring-icon_' + this.props.modifier, !!this.props.modifier));

    var viewBox = [0, 0, this.props.size, this.props.size].join(' ');

    return (<svg className={classList} viewBox={viewBox} />);
    /* jshint ignore:end */
  },

  componentDidMount: function() {
    // NB! Lazy initialization of template. Template is not inserted until it's
    // needed.
    if (_templateElement === null) {
      _initializeTemplate();
    }

    this.getDOMNode().innerHTML = '<use xlink:href="#' + this.props.modifier + '" />';
  }
});

/** @type {Icon} */
module.exports = Icon;
