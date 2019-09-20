import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import closeIcon from '@jetbrains/icons/close.svg';

import Icon from '../icon';
import Button from '../button/button';

import styles from './tag.css';

/**
 * @name Tag
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
    angled: PropTypes.bool,

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

  UNSAFE_componentWillReceiveProps(props) {
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
          className={styles.icon}
          title={this.props.rgTagTitle}
          glyph={this.props.rgTagIcon}
        />
      );
    }
    return null;
  }

  _renderImageElement(avatarSrc) {
    const classes = classNames({
      [styles.customIcon]: this.props.icon,
      [styles.avatarIcon]: avatarSrc
    });
    return (
      <img
        alt={avatarSrc ? 'Avatar' : 'Icon'}
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
          className={styles.avatarContainer}
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
        <Button
          icon={closeIcon}
          data-test="ring-tag-remove"
          className={styles.remove}
          iconClassName={styles.removeIcon}
          onClick={this.props.onRemove}
        />
      );
    }
    return null;
  }

  render() {
    const classes = classNames(
      'ring-js-shortcuts',
      styles.tag,
      {
        [styles.focused]: this.state.focused,
        [styles.disabled]: this.props.disabled,
        [styles.tagAngled]: this.props.angled,
        [styles.withRemove]: !this.props.readOnly
      },
      this.props.className
    );

    return (
      <span className={styles.container}>
        <button
          type="button"
          data-test="ring-tag"
          className={classes}
          ref={this.tagRef}
          onClick={this.props.onClick}
        >
          {this.renderAvatar()}
          {this.renderCustomIcon()}
          {this.renderImage()}
          <span className={styles.content}>{this.props.children}</span>
        </button>
        {this.renderRemoveIcon()}
      </span>
    );
  }
}
