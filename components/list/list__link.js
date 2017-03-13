import React, {PureComponent, PropTypes} from 'react';
import classnames from 'classnames';

import Link from '../link/link';

/**
 * @constructor
 * @extends {ReactComponent}
 */
export default class ListLink extends PureComponent {
  static propTypes = {
    ...Link.propTypes,
    description: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]),
    rgItemType: PropTypes.number,
    scrolling: PropTypes.bool,
    url: PropTypes.string
  };

  render() {
    const {className, label, description, rgItemType, scrolling, url, ...restProps} = this.props; // eslint-disable-line no-unused-vars

    const classes = classnames('ring-list__item', className);

    return (
      <Link
        pseudo={!restProps.href}
        {...restProps}
        className={classes}
      >
        {label}
      </Link>
    );
  }
}
