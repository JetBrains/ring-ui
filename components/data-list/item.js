/* @flow */
import React, {PureComponent, Element} from 'react';
import collapseIcon from 'jetbrains-icons/collapse.svg';
import expandIcon from 'jetbrains-icons/expand.svg';

import Checkbox from '../checkbox/checkbox';
import Icon from '../icon/icon';

import type {SubitemType, ItemType} from './types';
import styles from './data-list.css';

type Props = {
  item: ItemType,
  title: string,
  selectable: boolean,
  selected: boolean,
  showFocus: boolean,
  subitems: SubitemType[],
  collapsed: boolean,
  onCollapse: ItemType => void,
  onExpand: ItemType => void
};

export default class DataList extends PureComponent {
  static defaultProps = {
    selectable: false,
    selected: false,
    showFocus: false,
    subitems: [],
    collapsed: true,
    onCollapse: item => {},
    onExpand: item => {}
  };

  props: Props;

  onCheckboxFocus = () => {
    //this.props.onFocusRestore();
  }

  onCheckboxChange = () => {
    //this.toggleSelection();
  }

  onCollapse = () => {
    const {item, onCollapse} = this.props;
    onCollapse(item);
  }

  onExpand = () => {
    const {item, onExpand} = this.props;
    onExpand(item);
  }

  render(): Element<any> {
    const {
      title, selectable, selected, showFocus, subitems,
      collapsed
    } = this.props;

    let collapserExpander = null;
    if (subitems.length) {
      if (collapsed) {
        collapserExpander = (
          <Icon
            className={styles.collapseIcon}
            glyph={expandIcon}
            size={Icon.Size.Size14}
            onClick={this.onExpand}
          />
        );
      } else {
        collapserExpander = (
          <Icon
            className={styles.collapseIcon}
            glyph={collapseIcon}
            size={Icon.Size.Size14}
            onClick={this.onCollapse}
          />
        );
      }
    }

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

            {collapserExpander}
          </div>

          {title}

          {subitems.length && !collapsed
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
