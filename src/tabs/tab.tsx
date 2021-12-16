import React, {PureComponent, ReactNode} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dataTests from '../global/data-tests';

import styles from './tabs.css';
import {TabLinkProps} from './tab-link';

export interface TabProps {
  title?: ReactNode | ((isSelected: boolean, collapsed: boolean | undefined) => ReactNode)
  titleProps?: Partial<TabLinkProps>
  id?: string | null | undefined
  className?: string | null | undefined
  children?: ReactNode
  'data-test'?: string | null | undefined
  alwaysHidden?: boolean | null | undefined
  disabled?: boolean | undefined
  href?: string | undefined
  activeClassName?: string | null | undefined
  collapsedClassName?: string | null | undefined
  collapsedActiveClassName?: string | null | undefined
}
export default class Tab extends PureComponent<TabProps> {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    'data-test': PropTypes.string
  };

  render() {
    const {className, children, 'data-test': dataTest} = this.props;
    const classes = classNames(styles.tab, className);
    return (
      <div data-test={dataTests('ring-tab', dataTest)} className={classes}>{children}</div>
    );
  }
}
