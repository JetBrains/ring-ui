import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import styles from './island.css';

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

  static defaultProps = {
    'data-test': 'ring-island'
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames(styles.island, className);

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

export {default as Header} from './header';
export {default as Content} from './content';
