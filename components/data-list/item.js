/* @flow */
import React, {PureComponent, Element} from 'react';
import collapseIcon from 'jetbrains-icons/collapse.svg';
import expandIcon from 'jetbrains-icons/expand.svg';
import classNames from 'classnames';

import focusSensorHOC from '../global/focus-sensor-hoc';
import Checkbox from '../checkbox/checkbox';
import Icon from '../icon/icon';

import type {SubitemType, ItemType} from './types';
import styles from './data-list.css';

type Props = {
  className?: string,
  item: ItemType,
  title: string,
  selectable: boolean,
  selected: boolean,
  subitems: SubitemType[],
  collapsed: boolean,
  onCollapse: (item?: ItemType) => void,
  onExpand: (item?: ItemType) => void,
  onSelect: (selected: boolean) => void,
  showFocus: boolean,

  // focusSensorHOC
  onFocusRestore: () => void
};

class Item extends PureComponent {
  static defaultProps = {
    selectable: false,
    selected: false,
    subitems: [],
    collapsed: true,
    onCollapse: () => {},
    onExpand: () => {},
    showFocus: false
  };

  props: Props;

  onCheckboxFocus = (): void => {
    this.props.onFocusRestore();
  }

  onCheckboxChange = (): void => {
    this.toggleSelection();
  }

  toggleSelection(): void {
    const {selectable, selected, onSelect} = this.props;
    if (selectable) {
      onSelect(!selected);
    }
  }

  onCollapse = (): void => {
    const {item, onCollapse} = this.props;
    onCollapse(item);
  }

  onExpand = (): void => {
    const {item, onExpand} = this.props;
    onExpand(item);
  }

  render(): Element<any> {
    const {
      title, selectable, selected, subitems,
      collapsed, showFocus
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

    const classes = classNames(this.props.className, {
      [styles.item]: true,
      [styles.itemFocused]: showFocus,
      [styles.itemSelected]: selected
    });

    return (
      <li className={classes}>
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

export default focusSensorHOC(Item);
