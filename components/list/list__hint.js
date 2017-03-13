import React, {PureComponent, PropTypes} from 'react';

/**
 * @constructor
 * @extends {ReactComponent}
 */
export default class ListHint extends PureComponent {
  static propTypes = {
    label: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ])
  };

  render() {
    return (
      <span
        className="ring-list__item ring-list__item_hint"
      >{this.props.label}</span>
    );
  }
}
