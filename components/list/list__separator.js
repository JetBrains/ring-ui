import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class ListSeparator extends PureComponent {
  static propTypes = {
    description: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]),
    isFirst: PropTypes.bool
  };

  render() {
    const {description, isFirst} = this.props;

    const classes = classnames({
      'ring-list__separator': true,
      'ring-list__separator_empty': !description,
      'ring-list__separator_first': isFirst
    });

    return (
      <span className={classes}>{description}</span>
    );
  }
}
