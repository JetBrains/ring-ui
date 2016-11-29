import React, {PropTypes} from 'react';
import classNames from 'classnames';

import RingComponent from '../ring-component/ring-component';

import './island.scss';

/**
 * @name Island
 * @name Island
 * @category Components
 * @description Displays an island.
 * @example-file ./island.examples.html
 */

export default class Island extends RingComponent {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames('ring-island', className);

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

export class IslandHeader extends RingComponent {
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

export class IslandContent extends RingComponent {
  static propTypes = {
    className: PropTypes.string
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
