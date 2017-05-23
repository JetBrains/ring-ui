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
  selectable?: boolean,
  selected?: boolean,
  showFocus?: boolean,
  subitems?: SubitemType[],
  collapsed?: boolean,
  onCollapse?: ItemType => void,
  onExpand?: ItemType => void
};

export default class DataList extends PureComponent {
  defaultProps = {
    selectable: false,
    selected: false,
    showFocus: false,
    collapsed: true,
    onCollapse: () => {},
    onExpand: () => {}
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
    if (onCollapse) {
      onCollapse(item);
    }
  }

  onExpand = () => {
    const {item, onExpand} = this.props;
    if (onExpand) {
      onExpand(item);
    }
  }

  render(): Element<any> {
    const {
      title, selectable, selected, showFocus, subitems,
      collapsed
    } = this.props;

    let collapserExpander = null;
    if (subitems && subitems.length) {
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

          {subitems && !collapsed
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
