import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class ListTitle extends PureComponent {
  static propTypes = {
    description: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]),
    label: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]),
    isFirst: PropTypes.bool
  };

  render() {
    const {description, label, isFirst} = this.props;

    const classes = classNames('ring-list__title', 'ring-list__text', {
      'ring-list__title_first': isFirst
    });

    return (
      <span
        className={classes}
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
