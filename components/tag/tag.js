import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CloseIcon from 'jetbrains-icons/close.svg';

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
        tabIndex="0"
        className={classes}
        ref={this.tagRef}
        onClick={this.props.onClick}
      >
        {this.props.rgTagIcon ? (
          <Icon
            className="ring-tag__ring-icon"
            title={this.props.rgTagTitle}
            glyph={this.props.rgTagIcon}
            size={Icon.Size.Size12}
          />
        ) : null}
        {this.props.icon ? (
          <img
            className="ring-tag__custom-icon"
            src={this.props.icon}
          />
        ) : null}
        <span>{this.props.children}</span>

        {!this.props.readOnly ? (
          <Icon
            className="ring-tag__remove ring-link"
            glyph={CloseIcon}
            onClick={this.props.onRemove}
            size={Icon.Size.Size12}
          />
        ) : null}
      </span>);
  }
}
