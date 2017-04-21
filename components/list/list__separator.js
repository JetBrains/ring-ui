import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import styles from './list.css';

export default class ListSeparator extends PureComponent {
  static propTypes = {
    description: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ])
  };

  render() {
    return (
      <span
        className={styles.separator}
      >{this.props.description}</span>
    );
  }
}
