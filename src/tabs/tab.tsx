import {PureComponent, ReactNode} from 'react';
import classNames from 'classnames';

import dataTests from '../global/data-tests';

import {TabLinkProps} from './tab-link';

export interface TabProps {
  title?: ReactNode | ((isSelected: boolean, collapsed: boolean | undefined) => ReactNode);
  titleProps?: Partial<TabLinkProps>;
  id?: string | null | undefined;
  className?: string | null | undefined;
  children?: ReactNode;
  'data-test'?: string | null | undefined;
  alwaysHidden?: boolean | null | undefined;
  disabled?: boolean | undefined;
  href?: string | undefined;
  activeClassName?: string | null | undefined;
  collapsedClassName?: string | null | undefined;
  collapsedActiveClassName?: string | null | undefined;
}
export default class Tab extends PureComponent<TabProps> {
  render() {
    const {className, children, 'data-test': dataTest} = this.props;
    return (
      <div data-test={dataTests('ring-tab', dataTest)} className={classNames(className)}>
        {children}
      </div>
    );
  }
}
