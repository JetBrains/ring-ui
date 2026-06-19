import React, {forwardRef, useContext, useState} from 'react';
import classNames from 'classnames';
import chevronRightIcon from '@jetbrains/icons/chevron-12px-right';
import chevronDownIcon from '@jetbrains/icons/chevron-12px-down';

import Icon from '../icon/icon';
import Collapse from '../collapse/collapse';
import CollapseContent from '../collapse/collapse-content';
import {CollapseContext} from '../collapse/collapse-context';

import styles from './collapsible-group.css';

export interface CollapsibleGroupProps {
  avatar?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  className?: string | null | undefined;
  defaultExpanded?: boolean;
  expanded?: boolean | null | undefined;
  onChange?: (expanded: boolean) => void;
  disableAnimation?: boolean;
  interactive?: boolean;
  'data-test'?: string | null | undefined;
}

interface CollapsibleGroupHeaderContentProps {
  avatar?: React.ReactNode;
  titleContent: React.ReactNode;
  subtitle?: React.ReactNode;
}

type CollapsibleGroupHeaderProps = CollapsibleGroupHeaderContentProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

function CollapsibleGroupHeaderContent({avatar, titleContent, subtitle}: CollapsibleGroupHeaderContentProps) {
  const {collapsed} = useContext(CollapseContext);

  return (
    <span className={styles.header}>
      <span className={styles.headerContent}>
        <span className={styles.avatarGroup}>
          {avatar}
          <span className={styles.title}>{titleContent}</span>
        </span>
        {subtitle ? (
          <span className={styles.subtitleGroup}>
            <Icon className={styles.subtitleChevron} glyph={chevronRightIcon} aria-hidden />
            <span className={styles.subtitle}>{subtitle}</span>
          </span>
        ) : null}
      </span>
      <span className={styles.toggle} aria-hidden>
        <Icon className={styles.toggleIcon} glyph={collapsed ? chevronRightIcon : chevronDownIcon} />
      </span>
    </span>
  );
}

function CollapsibleGroupHeader({avatar, titleContent, subtitle, ...buttonProps}: CollapsibleGroupHeaderProps) {
  const {setCollapsed, collapsed, id} = useContext(CollapseContext);

  return (
    <button
      type='button'
      {...buttonProps}
      className={styles.headerButton}
      onClick={setCollapsed}
      aria-controls={`collapse-content-${id}`}
      aria-expanded={!collapsed}
    >
      <CollapsibleGroupHeaderContent avatar={avatar} titleContent={titleContent} subtitle={subtitle} />
    </button>
  );
}

function CollapsibleGroupHeaderStatic({avatar, titleContent, subtitle}: CollapsibleGroupHeaderContentProps) {
  return (
    <span className={styles.headerStatic}>
      <CollapsibleGroupHeaderContent avatar={avatar} titleContent={titleContent} subtitle={subtitle} />
    </span>
  );
}

const CollapsibleGroup = forwardRef<HTMLDivElement, CollapsibleGroupProps>(
  (
    {
      avatar,
      title,
      subtitle,
      children,
      className,
      defaultExpanded = false,
      expanded = null,
      onChange = () => {},
      disableAnimation = false,
      interactive = true,
      'data-test': dataTest,
    },
    ref,
  ) => {
    const [innerExpanded, setInnerExpanded] = useState(defaultExpanded);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const isExpanded = expanded ?? innerExpanded;

    const handleChange = (collapsed: boolean) => {
      const nextExpanded = !collapsed;
      if (expanded == null) {
        setInnerExpanded(nextExpanded);
      }
      onChange(nextExpanded);
    };

    const onBlur = (event: React.FocusEvent<HTMLElement>) => {
      const nextTarget = event.relatedTarget;
      if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
        return;
      }
      setFocused(false);
    };

    const classes = classNames(styles.expand, className, {
      [styles.hovered]: hovered,
      [styles.expanded]: isExpanded,
      [styles.focused]: focused,
    });

    return (
      <div ref={ref} className={classes} data-test={dataTest}>
        <Collapse
          defaultCollapsed={!defaultExpanded}
          collapsed={expanded == null ? null : !expanded}
          onChange={handleChange}
          disableAnimation={disableAnimation}
          className={styles.collapseRoot}
        >
          {interactive ? (
            <CollapsibleGroupHeader
              avatar={avatar}
              titleContent={title}
              subtitle={subtitle}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocus={() => setFocused(true)}
              onBlur={onBlur}
            />
          ) : (
            <CollapsibleGroupHeaderStatic avatar={avatar} titleContent={title} subtitle={subtitle} />
          )}
          <CollapseContent>
            <div className={styles.body}>{children}</div>
          </CollapseContent>
        </Collapse>
      </div>
    );
  },
);

CollapsibleGroup.displayName = 'CollapsibleGroup';

export default CollapsibleGroup;
