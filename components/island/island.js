import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import adaptiveIslandHOC from '../island/adaptive-island-hoc';

import styles from './island.css';

/**
 * @name Island
 * @name Island
 * @category Components
 * @tags Ring UI Language
 * @description Displays an island.
 * @example-file ./island.examples.html
 */

export default class Island extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    narrow: PropTypes.bool,
    wide: PropTypes.bool,
    withoutPaddings: PropTypes.bool
  };

  static defaultProps = {
    'data-test': 'ring-island'
  };

  render() {
    const {children, className, narrow, wide, withoutPaddings, ...restProps} = this.props;
    const classes = classNames(styles.island, className, {
      [styles.narrowIsland]: narrow,
      [styles.wideIsland]: wide,
      [styles.withoutPaddings]: withoutPaddings
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

export const AdaptiveIsland = adaptiveIslandHOC(Island);

export {default as Header} from './header';
export {default as Content} from './content';
