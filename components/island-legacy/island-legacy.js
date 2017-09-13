import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './island-legacy.scss';

/**
 * @name Island Legacy
 * @category Components
 * @description Displays an island.
 * @example-file ./island-legacy.examples.html
 */

export default class Island extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
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
