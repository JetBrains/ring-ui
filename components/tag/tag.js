import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Icon, {CloseIcon} from '../icon';

import './tag.scss';

/**
 * @name Tag
 * @category Components
 * @description Displays a tag.
 * @example-file ./tag.examples.html
 */

export default class Tag extends PureComponent {
  static propTypes = {
    onRemove: PropTypes.func,
    onClick: PropTypes.func,
    rgTagIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    icon: PropTypes.string,
    avatar: PropTypes.string,
    rgTagTitle: PropTypes.string,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    focused: PropTypes.bool,

    children: PropTypes.node,
    className: PropTypes.string
  };

  static defaultProps = {
    onRemove: () => {},
    onClick: () => {},
    readOnly: false,
    disabled: false,
    focused: false
  };

  state = {
    focused: false
  };

  componentWillReceiveProps(props) {
    this.updateStateFromProps(props);
  }

  componentDidUpdate() {
    if (this.state.focused) {
      this.tagNode.focus();
    }
  }

  componentWillUnmount() {
    this.setDocumentClickListener(false);
    this.setState({focused: false});
  }

  onDocumentClick = event => {
    if (this.tagNode) {
      this.setState({focused: this.tagNode === event.target});
    }
  };

  tagRef = el => {
    this.tagNode = el;
  };

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
        <CloseIcon
          data-test="ring-tag-remove"
          className="ring-tag__remove ring-link"
          onClick={this.props.onRemove}
          size={CloseIcon.Size.Size14}
        />
      );
    }
    return null;
  }

  render() {
    const classes = classNames(
      'ring-js-shortcuts',
      'ring-tag',
      {
        'ring-tag_focused': this.state.focused,
        'ring-tag_disabled': this.props.disabled
      },
      this.props.className
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
