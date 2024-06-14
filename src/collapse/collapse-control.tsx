import {useMemo, useContext, cloneElement} from 'react';
import * as React from 'react';

import dataTests from '../global/data-tests';

import {CollapseContext} from './collapse-context';
import {COLLAPSE_CONTROL_TEST_ID} from './consts';

type ChildrenFunction = (collapsed: boolean) => React.ReactElement;

type Props = {
  children: ChildrenFunction | React.ReactElement;
  'data-test'?: string | null | undefined;
};

/**
 * @name CollapseControl
 */

export const CollapseControl: React.FC<Props> = ({children, 'data-test': dataTest}) => {
  const {setCollapsed, collapsed, id} = useContext(CollapseContext);

  const child = useMemo<React.ReactElement>(() => {
    if (typeof children === 'function') {
      return children(collapsed);
    }

    return children;
  }, [children, collapsed]);

  return (
    <p data-test={dataTests(COLLAPSE_CONTROL_TEST_ID, dataTest)}>{cloneElement(child, {
      onClick: setCollapsed,
      'aria-controls': `collapse-content-${id}`,
      'aria-expanded': String(!collapsed)
    })}</p>
  );
};

export default CollapseControl;
