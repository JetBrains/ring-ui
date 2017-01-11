import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import './island-legacy.scss';

/**
 * @name Island Legacy
 * @category Components
 * @description Displays an island.
 * @example-file ./island-legacy.examples.html
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

export {default as Header} from './header-legacy';
export {default as Content} from './content-legacy';
