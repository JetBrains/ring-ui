import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import closeIcon from 'jetbrains-icons/close.svg';

import RingComponent from '../ring-component/ring-component';
import Icon from '../icon/icon';

import './tag.scss';

/**
 * @name Tag
 * @category Components
 * @description Displays a tag.
 * @example-file ./tag.examples.html
 */

export default class Tag extends RingComponent {
  static propTypes = {
    onRemove: PropTypes.func,
    onClick: PropTypes.func,
    rgTagIcon: PropTypes.string,
    icon: PropTypes.string,
    avatar: PropTypes.string,
    rgTagTitle: PropTypes.string,
    readOnly: PropTypes.bool,
    focused: PropTypes.bool
  };

  static defaultProps = {
    onRemove: () => { /* do nothing */ },
    onClick: () => { /* do nothing */ },
    readOnly: false,
    focused: false
  };

  state = {
    focused: false
  }

  onDocumentClick = event => {
    if (this.tag) {
      this.setState({focused: this.node === event.target});
    }
  }

  setDocumentClickListener(setListener) {
    if (setListener) {
      document.addEventListener('click', this.onDocumentClick);
    } else {
      document.removeEventListener('click', this.onDocumentClick);
    }
  }

  updateStateFromProps(props) {
    this.setState({focused: props.focused});
    this.setDocumentClickListener(props.focused);
  }

  didUpdate() {
    if (this.state.focused) {
      this.node.focus();
    }
  }

  willReceiveProps(props) {
    this.updateStateFromProps(props);
  }

  willUnmount() {
    this.setDocumentClickListener(false);
    this.setState({focused: false});
  }

  tagRef = el => {
    this.tag = el;
  };

  renderCustomIcon() {
    if (this.props.rgTagIcon) {
      return (
        <Icon
          className="ring-tag__ring-icon"
          title={this.props.rgTagTitle}
          glyph={this.props.rgTagIcon}
          size={Icon.Size.Size12}
        />
      );
    }
    return null;
  }

  _renderImageElement(avatarSrc) {
    const classes = classNames([
      {
        'ring-tag__custom-icon': this.props.icon
      },
      {
        'ring-tag__avatar-icon': avatarSrc
      }
    ]);
    return (
      <img
        className={classes}
        src={avatarSrc || this.props.icon}
      />
    );
  }

  renderImage() {
    if (this.props.icon && !this.props.avatar) {
      return this._renderImageElement();
    }
    return null;
  }

  renderAvatar() {
    if (this.props.avatar) {
      return (
        <span
          className="ring-tag__avatar-container"
        >
          {this._renderImageElement(this.props.avatar)}
        </span>
      );
    }
    return null;
  }

  renderRemoveIcon() {
    if (!this.props.readOnly) {
      return (
        <Icon
          data-test="ring-tag-remove"
          className="ring-tag__remove ring-link"
          glyph={closeIcon}
          onClick={this.props.onRemove}
          size={Icon.Size.Size14}
        />
      );
    }
    return null;
  }

  render() {
    const classes = classNames(
      'ring-tag',
      'ring-js-shortcuts',
      this.props.className, {
        'ring-tag_focused': this.state.focused
      }
    );

    return (
      <span
        data-test="ring-tag"
        tabIndex="0"
        className={classes}
        ref={this.tagRef}
        onClick={this.props.onClick}
      >
        {this.renderAvatar()}
        {this.renderCustomIcon()}
        {this.renderImage()}
        <span>{this.props.children}</span>
        {this.renderRemoveIcon()}
      </span>);
  }
}
