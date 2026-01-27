import React, {forwardRef} from 'react';
import classNames from 'classnames';
import chevronRightIcon from '@jetbrains/icons/chevron-12px-right';
import chevronDownIcon from '@jetbrains/icons/chevron-12px-down';

import Icon from '../icon/icon';

import {useExpandBehavior} from './expand.hooks';

import styles from './expand.css';

export interface ExpandProps {
  avatar?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  className?: string | null | undefined;
  defaultExpanded?: boolean;
  expanded?: boolean | null | undefined;
  onChange?: (expanded: boolean) => void;
  interactive?: boolean;
  'data-test'?: string | null | undefined;
}

const Expand = forwardRef<HTMLDivElement, ExpandProps>(
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
      interactive = true,
      'data-test': dataTest,
    },
    ref,
  ) => {
    const {
      bodyContainerRef,
      bodyContentRef,
      bodyId,
      titleId,
      bodyStyle,
      shouldRenderBody,
      headerProps,
      isExpanded,
      hovered,
      focused,
    } = useExpandBehavior({defaultExpanded, expanded, onChange, interactive});

    const classes = classNames(styles.expand, className, {
      [styles.interactive]: interactive,
      [styles.hovered]: hovered,
      [styles.expanded]: isExpanded,
      [styles.focused]: focused,
    });

    return (
      <div className={classes} data-test={dataTest} ref={ref}>
        <div
          className={styles.header}
          {...headerProps}
          aria-expanded={isExpanded}
          aria-controls={bodyId}
          aria-labelledby={titleId}
        >
          <div className={styles.headerContent}>
            <div className={styles.avatarGroup}>
              {avatar}
              <span className={styles.title} id={titleId}>
                {title}
              </span>
            </div>
            {subtitle ? (
              <div className={styles.subtitleGroup}>
                <Icon className={styles.subtitleChevron} glyph={chevronRightIcon} />
                <span className={styles.subtitle}>{subtitle}</span>
              </div>
            ) : null}
          </div>
          <span className={styles.toggle} aria-hidden>
            <Icon className={styles.toggleIcon} glyph={isExpanded ? chevronDownIcon : chevronRightIcon} />
          </span>
        </div>
        <div
          className={classNames(styles.bodyContainer, styles.bodyTransition)}
          id={bodyId}
          ref={bodyContainerRef}
          style={bodyStyle}
        >
          <div className={styles.body} ref={bodyContentRef}>
            {shouldRenderBody ? children : null}
          </div>
        </div>
      </div>
    );
  },
);

Expand.displayName = 'Expand';

export default Expand;
