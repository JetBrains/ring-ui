import React from 'react';
import RingComponent from 'ring-component/ring-component';
import Icon from 'icon/icon';

export default class Tag extends RingComponent {
  render() {
    return (<span className="tags-input__tag">
      <span>{this.props.children}</span>
      <Icon className="tags-input__tag-remove ring-link" glyph="close" size={Icon.Size.Size12}/>
    </span>);
  }
}
