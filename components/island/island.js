import React, {Component, PropTypes} from 'react';
import adaptiveIslandHOC from '../island/adaptive-island-hoc';
import classNames from 'classnames';
import styles from './island.css';

/**
 * @name Island
 * @name Island
 * @category Components
 * @description Displays an island.
 * @example-file ./island.examples.html
 */

export default class Island extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    narrow: PropTypes.bool
  };

  static defaultProps = {
    'data-test': 'ring-island'
  };

  render() {
    const {children, className, narrow, ...restProps} = this.props;
    const classes = classNames(styles.island, className, {
      [styles.narrowIsland]: narrow
    });

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

const AdaptiveIsland = adaptiveIslandHOC(Island);

export {AdaptiveIsland};
export {default as Header} from './header';
export {default as Content} from './content';
