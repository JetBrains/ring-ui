import React from 'react';
import RingComponent from '../ring-component/ring-component';
import Icon from '../icon/icon';
import './tag.scss';
import CloseIcon from 'jetbrains-icons/close.svg';

export default class Tag extends RingComponent {
  static propTypes = {
    onRemove: React.PropTypes.func,
    rgTagIcon: React.PropTypes.string
  };

  static defaultProps = {
    onRemove: () => { /* do nothing */ }
  };

  render() {
    return (<span className="ring-tag">
      {this.props.rgTagIcon ? (
        <Icon
          className="ring-tag__icon"
          glyph={this.props.rgTagIcon}
          size={Icon.Size.Size12}
        />
      ) : null}
      <span>{this.props.children}</span>
      <Icon
        className="ring-tag__remove ring-link"
        glyph={CloseIcon}
        onClick={this.props.onRemove}
        size={Icon.Size.Size12}
      />
    </span>);
  }
}
