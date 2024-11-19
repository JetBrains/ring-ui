import {ReactElement} from 'react';
import * as React from 'react';

import classNames from 'classnames';

import styles from './tabs.css';
import TabLink from './tab-link';
import {CustomItem} from './custom-item';
import {TabProps} from './tab';

export interface TabTitleProps {
  selected: boolean;
  child: ReactElement<TabProps> | null;
  handleSelect?: ((e: React.MouseEvent<HTMLAnchorElement>) => void) | undefined;
  collapsed?: boolean | undefined;
  tabIndex?: number | undefined;
}
const TabTitle = React.memo(function TabTitle({
  selected,
  child,
  handleSelect,
  collapsed = false,
  tabIndex,
}: TabTitleProps) {
  if (child == null || typeof child !== 'object' || child.type === CustomItem) {
    return child;
  }

  const {title, titleProps, disabled, href, className, activeClassName, collapsedClassName, collapsedActiveClassName} =
    child.props;

  const titleClasses = classNames(styles.title, className, {
    [styles.selected]: selected,
    [styles.collapsed]: collapsed,
    [activeClassName ?? '']: selected,
    [collapsedClassName ?? '']: collapsed,
    [collapsedActiveClassName ?? '']: collapsed && selected,
  });

  return (
    <TabLink
      title={title}
      isSelected={selected}
      active
      href={href}
      className={titleClasses}
      disabled={disabled}
      onPlainLeftClick={handleSelect}
      tabIndex={tabIndex}
      collapsed={collapsed}
      {...titleProps}
    />
  );
});

export interface TabTitlesParams extends Omit<Partial<TabTitleProps>, 'selected'> {
  items: ReactElement<TabProps>[];
  selected?: string | undefined;
  onSelect?: ((key: string) => ((e: React.MouseEvent<HTMLAnchorElement>) => void) | undefined) | undefined;
}
const getTabTitles = ({items, selected = '0', collapsed, onSelect = () => undefined, ...props}: TabTitlesParams) =>
  items.map((tab, index) => {
    const key = tab.props.id || String(index);
    const isSelected = selected === key;

    return (
      <TabTitle
        key={key}
        handleSelect={onSelect(key)}
        selected={isSelected}
        child={tab}
        collapsed={collapsed}
        {...props}
      />
    );
  });

export default getTabTitles;
