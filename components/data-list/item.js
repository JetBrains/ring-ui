/* @flow */
/* eslint-disable react/jsx-max-props-per-line */

import React, {PureComponent, Element} from 'react';

import Checkbox from '../checkbox/checkbox';

import styles from './data-list.css';

type Props = {
  title: string,
  selectable?: boolean,
  selected?: boolean,
  showFocus?: boolean
};

export default class DataList extends PureComponent {
  props: Props;

  defaultProps = {
    selectable: false,
    selected: false,
    showFocus: false
  };

  onCheckboxFocus = () => {
    //this.props.onFocusRestore();
  }

  onCheckboxChange = () => {
    //this.toggleSelection();
  }

  render(): Element<any> {
    const {title, selectable, selected, showFocus} = this.props;

    return (
      <li className={styles.item}>
        <span className={styles.itemTitle}>
          <div className={styles.metaColumn}>
            {selectable &&
              <Checkbox
                className={showFocus ? 'ring-checkbox_focus' : ''}
                checked={selected}
                onFocus={this.onCheckboxFocus}
                onChange={this.onCheckboxChange}
                tabIndex="-1"
              />
            }
          </div>

          {title}
        </span>
      </li>
    );
  }
}
