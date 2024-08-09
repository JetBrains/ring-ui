import {PureComponent, ReactElement} from 'react';
import * as React from 'react';
import classNames from 'classnames';

import memoize from '../global/memoize';

import dataTests from '../global/data-tests';

import styles from './tabs.css';

import TabLink from './tab-link';
import CollapsibleTabs, {CollapsibleTabsProps} from './collapsible-tabs';
import {CustomItem} from './custom-item';

import {TabProps} from './tab';

export {CustomItem};

export type Children =
  readonly (Children | null | boolean)[] | ReactElement<TabProps> | null | boolean;

export interface TabsProps extends Omit<CollapsibleTabsProps, 'onSelect' | 'children'> {
  children: Children
  onSelect: (key: string) => void
  className?: string | null | undefined
  tabContainerClassName?: string | null | undefined
  autoCollapse?: boolean | null | undefined
  'data-test'?: string | null | undefined
}

class Tabs extends PureComponent<TabsProps> {
  static defaultProps = {
    onSelect() {}
  };

  handleSelect = memoize((key: string) => () => this.props.onSelect(key));

  getTabTitle = (child: ReactElement<TabProps>, i: number) => {
    if (child == null || typeof child !== 'object' || child.type === CustomItem) {
      return child;
    }

    const {selected} = this.props;
    const {title, titleProps, id, disabled, href, className, activeClassName} = child.props;
    const key = id || String(i);
    const isSelected = key === selected;
    const titleClasses = classNames(
      styles.title,
      className,
      isSelected && activeClassName,
      {
        [styles.selected]: isSelected
      }
    );

    return (
      <TabLink
        title={title}
        isSelected={isSelected}
        key={key}
        href={href}
        className={titleClasses}
        disabled={disabled}
        onPlainLeftClick={this.handleSelect(key)}
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
      ...restProps
    } = this.props;

    const classes = classNames(styles.tabs, className);
    const childrenArray = React.Children.toArray(children).
      filter(Boolean) as ReactElement<TabProps>[];

    return (
      <div className={classes} data-test={dataTests('ring-dumb-tabs', dataTest)}>
        {autoCollapse === true
          ? (
            <CollapsibleTabs
              {...restProps}
              onSelect={this.handleSelect}
              selected={selected}
            >{childrenArray}</CollapsibleTabs>
          )
          : (
            <div className={styles.titles}>
              {childrenArray.map(this.getTabTitle)}
            </div>
          )}
        <div className={classNames(tabContainerClassName)}>
          {childrenArray.find(({props}, i) => (props.id || String(i)) === selected)}
        </div>
      </div>
    );
  }
}
export type TabsAttrs = JSX.LibraryManagedAttributes<typeof Tabs, TabsProps>
export default Tabs;
