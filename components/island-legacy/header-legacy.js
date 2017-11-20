import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './island-legacy.scss';

export default class Header extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames('ring-island__header', className);

    return (
      <div
        {...restProps}
        className={classes}
      >
        <div className="ring-island__title">
          {children}
        </div>
      </div>
    );
  }
}
