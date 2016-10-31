/**
 * @fileOverview HeaderItem subcomponent
 */

import React from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import Icon from '../icon/icon';

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
  image.style[margin] = `${Math.round(compensation)}px`;
}

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
    const {className, href, testKey, glyph, onOpen, onClose, activeClassName, inactiveClassName, ...restProps} = this.props; // eslint-disable-line no-unused-vars
    const classes = classNames(
      {
        'ring-header__user-menu-item': true,
        'ring-header__user-menu-item_icon': true,
        [`ring-header__user-menu-item__${glyph}`]: true,
        'ring-icon_loading': this.state.loading
      },
      className
    );

    // NB! Wrapping span is needed because otherwise selenium tests couldn't
    // trigger the click on the <SVG /> element.
    const iconElement = this.state.picture ? this._getImage(restProps) : this._getIcon(restProps);
    const dataTest = testKey ? `header-${testKey}` : null;

    return (
      <span
        {...restProps}
        data-test={dataTest}
        className={classes}
        onClick={::this._handleClick}
        title={this.state.title}
      >
        {href
          ? <a href={href}>{iconElement}</a>
          : iconElement
        }
      </span>
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
  _getImage(restProps) {
    const classes = classNames(
      {
        'ring-icon': true,
        'ring-icon_24': true,
        [`ring-icon_${this.props.glyp}`]: true
      },
      this.props.className
    );

    return (
      <span
        {...restProps}
        className={classes}
      >
        <img
          className={'ring-icon__pic'}
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
  _getIcon(restProps) {
    return (
      <Icon {...restProps}
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
    if (!this.props.onOpen && !this.props.onClose) { // It is not a dropdown item
      return;
    }

    this.setState({opened}, function () {
      if (opened && typeof this.props.onOpen === 'function') {
        this.props.onOpen();
      } else if (!opened && typeof this.props.onClose === 'function') {
        this.props.onClose();
      }
    });
  }

  /**
   * @param {string} title
   */
  setTitle(title) {
    this.setState({title});
  }

  /**
   * @param {boolean} loading
   */
  setLoading(loading) {
    this.setState({loading});
  }
}
