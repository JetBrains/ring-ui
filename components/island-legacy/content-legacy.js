import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './island-legacy.scss';

export default class Content extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames('ring-island__content', className);

    return (
      <div
        {...restProps}
        className={classes}
      >
        {children}
      </div>
    );
  }
}
