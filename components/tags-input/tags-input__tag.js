import React from 'react';
import RingComponent from 'ring-component/ring-component';
import Icon from 'icon/icon';

export default class Tag extends RingComponent {
  static propTypes = {
    onRemove: React.PropTypes.func
  };

  static defaultProps = {
    onRemove: () => {}
  };

  render() {
    return (<span className="tags-input__tag">
      <span>{this.props.children}</span>
      <Icon onClick={this.props.onRemove}
            className="tags-input__tag-remove ring-link"
            glyph="close"
            size={Icon.Size.Size12}/>
    </span>);
  }
}

export class TagWithIcon extends RingComponent {
  static propTypes = {
    onRemove: React.PropTypes.func,
    iconName: React.PropTypes.string
  };

  static defaultProps = {
    onRemove: () => {}
  };

  render() {
    return (<span className="tags-input__tag">
      {this.props.iconName ? <Icon className="tags-input__tag-icon"
            glyph={this.props.iconName}
            size={Icon.Size.Size12}/> : null}
      <span>{this.props.children}</span>
      <Icon onClick={this.props.onRemove}
            className="tags-input__tag-remove ring-link"
            glyph="close"
            size={Icon.Size.Size12}/>
    </span>);
  }
}
