import React, {PureComponent, PropTypes} from 'react';

export default class ListTitle extends PureComponent {
  static propTypes = {
    description: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]),
    label: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ])
  };

  render() {
    const {description, label} = this.props;
    return (
      <span
        className="ring-list__title ring-list__text"
        data-test="ring-list-title"
      >
        <span
          className="ring-list__item__label ring-list__title-text"
        >{label}</span>
        <div className="ring-list__item__description">{description}</div>
      </span>
    );
  }
}
