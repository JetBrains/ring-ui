import React, {PureComponent} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import conicGradient from '../global/conic-gradient';
import {injectRuleSet} from '../global/inject-styles';

import styles from './loader-inline.css';

injectRuleSet(`.${styles.loader}`, {
  'background-image': conicGradient([
    '#000',
    '#e32581',
    '#d73cea',
    '#9135e0',
    '#5848f4',
    '#25b7ff',
    '#59bd00',
    '#fbac02',
    '#000'
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
