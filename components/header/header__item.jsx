/**
 * @fileOverview HeaderItem subcomponent
 * @jsx React.DOM
 */

var React = require('react');
var Global = require('global/global');
var Icon = require('icon/icon');
var ClassName = require('class-name/class-name');

/**
 * Fits a rectangular image into a square container. Sets the smaller side of an image
 * to equal the side of square and centers another side of image by setting
 * negative margin.
 * @param {Image} image
 * @param {number} width
 * @param {number} height
 */
var fitImageIntoSquare = function(image, width, height) {
  var SIZE = Global.RING_UNIT * 3;
  var isPortrait = height > width;
  var dimension = isPortrait ? 'width' : 'height';
  var margin = isPortrait ? 'margin-top' : 'margin-left';
  var adjustedSideOriginal = isPortrait ? width : height;
  var oppositeSideOriginal = isPortrait ? height : width;

  var oppositeSide = oppositeSideOriginal * SIZE / adjustedSideOriginal;
  var compensation = -(oppositeSide - SIZE) / 2;

  image.setAttribute(dimension, SIZE.toString());
  image.style[margin] = Math.round(compensation) + 'px';
};

/**
 * @type {ClassName}
 * @private
 */
var itemClassName = new ClassName('ring-header__user-menu-item');

/**
 * @constructor
 * @extends {ReactComponent}
 * @private
 */
var HeaderItem = React.createClass({
  getDefaultProps: function () {
    return {
      glyph: '',
      href: null,
      onOpen: null,
      onClose: null
    };
  },

  getInitialState: function () {
    return {
      loading: false,
      opened: false,
      picture: null,
      title: ''
    };
  },

  render: function () {
    var className = React.addons.classSet(Global.createObject(
      itemClassName.getClassName(), true,
      itemClassName.getClassName(null, 'icon'), true,
      itemClassName.getClassName(this.props.glyph), true,
      'ring-icon_loading', this.state.loading));

    // NB! Wrapping span is needed because otherwise selenium tests couldn't
    // trigger the click on the <SVG /> element.
    var iconElement = this.state.picture ? this._getImage() : this._getIcon();
    var menuElement = (<span className={className} onClick={this._handleClick} title={this.state.title}>
      {this.props.href ?
        (<a href={this.props.href}>{this.transferPropsTo(iconElement)}</a>) :
        this.transferPropsTo(iconElement)}
    </span>);

    return this.transferPropsTo(menuElement);
  },

  /**
   * @param {SyntheticMouseEvent} evt
   * @private
   */
  _handleClick: function(evt) {
    if (!this.props.href) {
      evt.preventDefault();

      this.setOpened(!this.state.opened);
    }
  },

  /**
   * @return {ReactComponent}
   * @private
   */
  _getImage: function() {
    var baseClass = new ClassName('ring-icon');
    var className = React.addons.classSet(Global.createObject(
      baseClass.getClassName(), true,
      baseClass.getModifier('24'), true,
      baseClass.getModifier(this.props.glyph), true));

    return (<span className={className}><img className={baseClass.getElement('pic')}
                                             onLoad={function(evt) {
          var pic = evt.target;
          fitImageIntoSquare(pic, pic.width, pic.height);
        }}
                                             src={this.state.picture}
                                             title={this.state.title || this.props.title} />
    </span>);
  },

  /**
   * @return {ReactComponent}
   * @private
   */
  _getIcon: function() {
    return (<Icon
      color={this.state.opened ? 'blue' : 'gray'}
      glyph={this.props.glyph}
      size={Icon.Size.Size18}
      title={this.state.title || this.props.title} />);
  },

  /**
   * @param {boolean} opened
   */
  setOpened: function (opened) {
    this.setState({opened: opened}, function () {
      if (opened) {
        if (typeof this.props.onOpen === 'function') {
          this.props.onOpen();
        }
      } else if (typeof this.props.onClose === 'function') {
        this.props.onClose();
      }
    });
  },

  /**
   * @param {string} title
   */
  setTitle: function(title) {
    this.setState({ title: title });
  },

  /**
   * @param {boolean} loading
   */
  setLoading: function(loading) {
    this.setState({ loading: loading });
  }
});

module.exports = HeaderItem;
