import React, {PureComponent} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import conicGradient from '../global/conic-gradient';
import {injectRuleSet} from '../global/inject-styles';

import styles from './loader-inline.css';

injectRuleSet(`.${styles.loader}`, {
  'background-image': conicGradient([
    '#ff008c',
    '#ac3cff',
    '#008eff',
    '#58ba00',
    '#f48700',
    '#ff008c'
  ])
});

/**
 * @name Loader Inline
 * @category Components
 * @tags Ring UI Language
 * @constructor
 * @description Displays a small animated loader, shown inline with text. Use case: contextual loading animation.
 * @extends {ReactComponent}
 * @example-file ./loader-inline.examples.html
 */

export default class LoaderInline extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const classes = classNames(
      styles.loader,
      this.props.className
    );

    return (
      <div
        {...this.props}
        className={classes}
      />
    );
  }
}
