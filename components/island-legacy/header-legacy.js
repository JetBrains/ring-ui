import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import './island-legacy.scss';

export default class Header extends RingComponent {
  static propTypes = {
    className: PropTypes.string
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
