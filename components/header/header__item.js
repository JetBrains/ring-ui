/**
 * @fileOverview HeaderItem subcomponent
 */

import React from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import Icon from '../icon/icon';
import ClassName from '../class-name/class-name';

/**
 * Fits a rectangular image into a square container. Sets the smaller side of an image
 * to equal the side of square and centers another side of image by setting
 * negative margin.
 * @param {Image} image
 * @param {number} width
 * @param {number} height
 */
function fitImageIntoSquare(image, width, height) {
  const SIZE = RingComponent.RING_UNIT * 3;
  const isPortrait = height > width;
  const dimension = isPortrait ? 'width' : 'height';
  const margin = isPortrait ? 'margin-top' : 'margin-left';
  const adjustedSideOriginal = isPortrait ? width : height;
  const oppositeSideOriginal = isPortrait ? height : width;

  const oppositeSide = oppositeSideOriginal * SIZE / adjustedSideOriginal;
  const compensation = -(oppositeSide - SIZE) / 2;

  image.setAttribute(dimension, SIZE.toString());
  image.style[margin] = Math.round(compensation) + 'px';
}

/**
 * @type {ClassName}
 * @private
 */
const itemClassName = new ClassName('ring-header__user-menu-item');

/**
 * @constructor
 * @extends {ReactComponent}
 * @private
 */
export default class HeaderItem extends RingComponent {
  static defaultProps = {
    glyph: '',
    href: null,
    onOpen: null,
    onClose: null,
    activeClassName: 'ring-header__user-menu-item_active',
    inactiveClassName: 'ring-header__user-menu-item_inactive'
  };

  state = {
    loading: false,
    opened: false,
    picture: null,
    title: ''
  };

  render() {
    const classes = classNames(
      {
        [itemClassName.getClassName()]: true,
        [itemClassName.getClassName(null, 'icon')]: true,
        [itemClassName.getClassName(this.props.glyph)]: true,
        'ring-icon_loading': this.state.loading
      },
      this.props.className
    );

    // NB! Wrapping span is needed because otherwise selenium tests couldn't
    // trigger the click on the <SVG /> element.
    const iconElement = this.state.picture ? this._getImage() : this._getIcon();

    return (
      <span
        {...this.props}
        className={classes}
        onClick={::this._handleClick}
        title={this.state.title}
      >{this.props.href ? <a href={this.props.href}>{iconElement}</a> : iconElement}</span>
    );
  }

  /**
   * @param {SyntheticMouseEvent} evt
   * @private
   */
  _handleClick(evt) {
    if (!this.props.href) {
      evt.preventDefault();

      this.setOpened(!this.state.opened);
    }
  }

  /**
   * @return {ReactComponent}
   * @private
   */
  _getImage() {
    const baseClass = new ClassName('ring-icon');

    const classes = classNames(
      {
        [baseClass.getClassName()]: true,
        [baseClass.getModifier('24')]: true,
        [baseClass.getModifier(this.props.glyph)]: true
      },
      this.props.className
    );

    return (
      <span
        {...this.props}
        className={classes}
      >
        <img
          className={baseClass.getElement('pic')}
          onLoad={function (evt) {
            const pic = evt.target;
            fitImageIntoSquare(pic, pic.width, pic.height);
          }}
          src={this.state.picture}
          title={this.state.title || this.props.title}
        />
      </span>
    );
  }

  /**
   * @return {ReactComponent}
   * @private
   */
  _getIcon() {
    return (
      <Icon {...this.props}
        className={this.state.opened ? this.props.activeClassName : this.props.inactiveClassName}
        glyph={this.props.glyph}
        size={Icon.Size.Size18}
        title={this.state.title || this.props.title}
      />
    );
  }

  /**
   * @param {boolean} opened
   */
  setOpened(opened) {
    this.setState({opened: opened}, function () {
      if (opened) {
        if (typeof this.props.onOpen === 'function') {
          this.props.onOpen();
        }
      } else if (typeof this.props.onClose === 'function') {
        this.props.onClose();
      }
    });
  }

  /**
   * @param {string} title
   */
  setTitle(title) {
    this.setState({title: title});
  }

  /**
   * @param {boolean} loading
   */
  setLoading(loading) {
    this.setState({loading: loading});
  }
}
