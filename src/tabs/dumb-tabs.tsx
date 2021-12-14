import React, {ComponentPropsWithRef, PureComponent, ReactElement} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import memoize from '../global/memoize';

import Theme, {ThemeProps, withTheme} from '../global/theme';
import dataTests from '../global/data-tests';

import styles from './tabs.css';

import TabLink from './tab-link';
import CollapsibleTabs, {CollapsibleTabsProps} from './collapsible-tabs';
import {CustomItem} from './custom-item';

import {TabProps} from './tab';

export {CustomItem};

type Children = readonly Children[] | ReactElement<TabProps> | null | boolean

export interface TabsProps extends ThemeProps, Omit<CollapsibleTabsProps, 'onSelect' | 'children'> {
  children: Children
  onSelect: (key: string) => void
  className?: string | null | undefined
  autoCollapse?: boolean | null | undefined
  'data-test'?: string | null | undefined
}

class Tabs extends PureComponent<TabsProps> {
  static propTypes = {
    theme: PropTypes.string,
    selected: PropTypes.string,
    className: PropTypes.string,
    href: PropTypes.string,
    children: PropTypes.node.isRequired,
    onSelect: PropTypes.func,
    'data-test': PropTypes.string,
    autoCollapse: PropTypes.bool
  };

  static defaultProps = {
    onSelect() {}
  };

  static Theme = Theme;

  handleSelect = memoize((key: string) => () => this.props.onSelect(key));

  getTabTitle = (child: ReactElement<TabProps>, i: number) => {
    if (child == null || typeof child !== 'object' || child.type === CustomItem) {
      return child;
    }

    const {selected} = this.props;
    const {title, id, disabled, href, className, activeClassName} = child.props;
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
        active
        key={key}
        href={href}
        innerClassName={titleClasses}
        className={titleClasses}
        disabled={disabled}
        onPlainLeftClick={this.handleSelect(key)}
      />
    );
  };

  render() {
    const {
      className,
      children,
      selected,
      theme,
      autoCollapse,
      'data-test': dataTest,
      ...restProps
    } = this.props;

    const classes = classNames(styles.tabs, className, styles[theme]);
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
        <div className={styles.tab}>
          {childrenArray.find(({props}, i) => (props.id || String(i)) === selected)}
        </div>
      </div>
    );
  }
}
const ThemedTabs = withTheme()(Tabs);
export type TabsAttrs = ComponentPropsWithRef<typeof ThemedTabs>
export default ThemedTabs;
