import {PureComponent, type ReactElement} from 'react';
import * as React from 'react';
import classNames from 'classnames';

import memoize from '../global/memoize';
import dataTests from '../global/data-tests';
import TabLink from './tab-link';
import CollapsibleTabs, {type CollapsibleTabsProps} from './collapsible-tabs';
import {CustomItem} from './custom-item';
import {type TabProps} from './tab';

import styles from './tabs.css';

export {CustomItem};

export type Children = readonly (Children | null | boolean)[] | ReactElement<TabProps> | null | boolean;

export interface TabsProps extends Omit<CollapsibleTabsProps, 'onSelect' | 'children'> {
  children: Children;
  onSelect?: ((key: string) => void) | null | undefined;
  onLastVisibleIndexChange?: ((index: number) => void) | null | undefined;
  className?: string | null | undefined;
  tabContainerClassName?: string | null | undefined;
  autoCollapse?: boolean | null | undefined;
  'data-test'?: string | null | undefined;
}

class Tabs extends PureComponent<TabsProps> {
  handleSelect = memoize((key: string) => () => this.props.onSelect?.(key));

  getTabTitle = (child: ReactElement<TabProps>, i: number) => {
    if (child === null || typeof child !== 'object' || child.type === CustomItem) {
      return child;
    }

    const {selected, onSelect} = this.props;
    const {title, titleProps, id, disabled, href, className, activeClassName} = child.props;
    const key = id || String(i);
    const isSelected = key === selected;
    const titleClasses = classNames(styles.title, className, isSelected && activeClassName, {
      [styles.selected]: isSelected,
    });

    return (
      <TabLink
        title={title}
        isSelected={isSelected}
        key={key}
        href={href}
        className={titleClasses}
        disabled={disabled}
        onPlainLeftClick={onSelect ? this.handleSelect(key) : undefined}
        {...titleProps}
      />
    );
  };

  render() {
    const {
      className,
      tabContainerClassName,
      children,
      selected,
      autoCollapse,
      'data-test': dataTest,
      onSelect,
      ...restProps
    } = this.props;

    const classes = classNames(styles.tabs, className);
    const childrenArray = React.Children.toArray(children).filter(Boolean) as ReactElement<TabProps>[];

    return (
      <div className={classes} data-test={dataTests('ring-dumb-tabs', dataTest)}>
        {autoCollapse === true ? (
          <CollapsibleTabs {...restProps} onSelect={onSelect ? this.handleSelect : undefined} selected={selected}>
            {childrenArray}
          </CollapsibleTabs>
        ) : (
          <div className={styles.titles}>{childrenArray.map(this.getTabTitle)}</div>
        )}
        <div className={classNames(tabContainerClassName)}>
          {childrenArray.find(({props}, i) => (props.id || String(i)) === selected)}
        </div>
      </div>
    );
  }
}
export type TabsAttrs = React.JSX.LibraryManagedAttributes<typeof Tabs, TabsProps>;
export default Tabs;
