/* @flow */
/* eslint-disable react/jsx-max-props-per-line */

import React, {PureComponent, Element} from 'react';

import Checkbox from '../checkbox/checkbox';
import Icon from '../icon/icon';

import type {SubitemType, ItemType} from './types';
import styles from './data-list.css';
import collapseIcon from 'jetbrains-icons/collapse.svg';
import expandIcon from 'jetbrains-icons/expand.svg';

type Props = {
  title: string,
  selectable?: boolean,
  selected?: boolean,
  showFocus?: boolean,
  subitems?: SubitemType[],
  collapsed?: boolean,
  onCollapse?: ItemType => void,
  onExpand?: ItemType => void
};

export default class DataList extends PureComponent {
  props: Props;

  defaultProps = {
    selectable: false,
    selected: false,
    showFocus: false,
    collapsed: true,
    onCollapse: () => {},
    onExpand: () => {}
  };

  onCheckboxFocus = () => {
    //this.props.onFocusRestore();
  }

  onCheckboxChange = () => {
    //this.toggleSelection();
  }

  render(): Element<any> {
    const {
      title, selectable, selected, showFocus, subitems,
      collapsed, onCollapse, onExpand
    } = this.props;

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

            {subitems && subitems.length
              ? (collapsed
                ? (
                  <Icon
                    glyph={collapseIcon}
                    size={Icon.Size.Size14}
                    onClick={onCollapse}
                  />
                ) : (
                  <Icon
                    glyph={expandIcon}
                    size={Icon.Size.Size14}
                    onClick={onExpand}
                  />
                )
              ) : null
            }
          </div>

          {title}

          {subitems
            ? (
              <ul className={styles.subgroup}>
                {subitems.map(subitem => (
                  <li key={subitem.id} className={styles.subitem}>{subitem.title}</li>
                ))}
              </ul>
            ) : null
          }
        </span>
      </li>
    );
  }
}
