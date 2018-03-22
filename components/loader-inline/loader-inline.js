import React, {PureComponent} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import conicGradient from '../global/conic-gradient';
import {injectRuleSet} from '../global/inject-styles';
import Theme from '../global/theme';

import styles from './loader-inline.css';

injectRuleSet(`.${styles[Theme.LIGHT]}`, {
  'background-image': conicGradient([
    '#ff008c',
    '#ac3cff',
    '#008eff',
    '#58ba00',
    '#f48700',
    '#ff008c'
  ])
});

injectRuleSet(`.${styles[Theme.DARK]}`, {
  'background-image': conicGradient([
    '#ff35a4',
    '#cd89ff',
    '#289fff',
    '#88d444',
    '#ffe000',
    '#ff35a4'
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
  static Theme = Theme;
  static propTypes = {
    theme: PropTypes.oneOf(Object.values(Theme)),
    className: PropTypes.string
  };

  static defaultProps = {
    theme: Theme.LIGHT
  };

  render() {
    const classes = classNames(
      styles.loader,
      this.props.className,
      styles[this.props.theme]
    );

    return (
      <div
        {...this.props}
        className={classes}
      />
    );
  }
}
