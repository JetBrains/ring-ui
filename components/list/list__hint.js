import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './list.css';

/**
 * @constructor
 * @extends {ReactComponent}
 */
export default class ListHint extends PureComponent {
  static propTypes = {
    label: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ])
  };

  render() {
    return (
      <span
        className={classnames(styles.item, styles.hint)}
        data-test="ring-list-hint"
      >{this.props.label}</span>
    );
  }
}
