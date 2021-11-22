import React from 'react';

import classNames from 'classnames';

import PropTypes from 'prop-types';

import styles from './tabs.css';
import TabLink from './tab-link';
import {CustomItem} from './custom-item';

function noop() {}

const TabTitle = React.memo(function TabTitle({
  selected,
  child,
  handleSelect = noop,
  collapsed = false,
  tabIndex
}) {
  if (child == null || typeof child !== 'object' || child.type === CustomItem) {
    return child;
  }

  const {
    title,
    disabled,
    href,
    className,
    activeClassName,
    collapsedClassName,
    collapsedActiveClassName
  } = child.props;

  const titleClasses = classNames(styles.title, className, {
    [styles.selected]: selected,
    [styles.collapsed]: collapsed,
    [activeClassName]: selected,
    [collapsedClassName]: collapsed,
    [collapsedActiveClassName]: collapsed && selected
  });

  return (
    <TabLink
      title={title}
      isSelected={selected}
      active
      href={href}
      innerClassName={titleClasses}
      className={titleClasses}
      disabled={disabled}
      onPlainLeftClick={handleSelect}
      tabIndex={tabIndex}
      collapsed={collapsed}
    />
  );
});

TabTitle.propTypes = {
  child: PropTypes.element,
  handleSelect: PropTypes.func,
  selected: PropTypes.bool,
  collapsed: PropTypes.bool,
  tabIndex: PropTypes.number
};

const getTabTitles = ({
  items,
  selected = 0,
  collapsed,
  onSelect = noop,
  ...props
}) => items.map((tab, index) => {
  const key = tab.props.id || String(index);
  const isSelected = selected === key;

  return (
    <TabTitle
      key={key}
      handleSelect={onSelect(key)}
      selected={isSelected}
      child={tab}
      index={index}
      collapsed={collapsed}
      disabled={tab.props.disabled}
      {...props}
    />
  );
});

export default getTabTitles;
