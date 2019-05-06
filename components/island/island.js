import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import adaptiveIslandHOC from '../island/adaptive-island-hoc';
import dataTests from '../global/data-tests';

import styles from './island.css';

/**
 * @name Island
 */

export default class Island extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    narrow: PropTypes.bool,
    withoutPaddings: PropTypes.bool,
    'data-test': PropTypes.string
  };

  render() {
    // eslint-disable-next-line max-len
    const {children, className, narrow, withoutPaddings, 'data-test': dataTest, ...restProps} = this.props;
    const classes = classNames(styles.island, className, {
      [styles.narrowIsland]: narrow,
      [styles.withoutPaddings]: withoutPaddings
    });

    return (
      <div
        {...restProps}
        className={classes}
        data-test={dataTests('ring-island', dataTest)}
      >
        {children}
      </div>
    );
  }
}

export const AdaptiveIsland = adaptiveIslandHOC(Island);

export {default as Header} from './header';
export {default as Content} from './content';
