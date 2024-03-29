import React, {useMemo, useContext, cloneElement} from 'react';

import dataTests from '../global/data-tests';

import {CollapseContext} from './collapse-context';
import {COLLAPSE_CONTROL_TEST_ID} from './consts';

type ChildrenFunction = (collapsed: boolean) => React.ReactNode;

type Props = {
  children: ChildrenFunction | React.ReactNode;
  'data-test'?: string | null | undefined;
};

/**
 * @name CollapseControl
 */

export const CollapseControl: React.FC<Props> = ({children, 'data-test': dataTest}) => {
  const {setCollapsed, collapsed, id} = useContext(CollapseContext);

  const child = useMemo<React.ReactElement>(() => {
    if (typeof children === 'function') {
      return <p data-test={dataTests(COLLAPSE_CONTROL_TEST_ID, dataTest)}>{children(collapsed)}</p>;
    }

    return <p data-test={dataTests(COLLAPSE_CONTROL_TEST_ID, dataTest)}>{children}</p>;
  }, [children, collapsed, dataTest]);

  return cloneElement(child, {
    onClick: setCollapsed,
    'aria-controls': `collapse-content-${id}`,
    'aria-expanded': String(!collapsed)
  });
};

export default CollapseControl;
