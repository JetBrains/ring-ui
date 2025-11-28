import {useContext, cloneElement} from 'react';
import * as React from 'react';

import dataTests from '../global/data-tests';
import {CollapseContext} from './collapse-context';
import {COLLAPSE_CONTROL_TEST_ID} from './consts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChildrenFunction = (collapsed: boolean) => React.ReactElement<any>;

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: ChildrenFunction | React.ReactElement<any>;
  'data-test'?: string | null | undefined;
}

/**
 * @name CollapseControl
 */

export const CollapseControl: React.FC<Props> = ({children, 'data-test': dataTest}) => {
  const {setCollapsed, collapsed, id} = useContext(CollapseContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const child: React.ReactElement<any> = typeof children === 'function' ? children(collapsed) : children;

  return (
    <p data-test={dataTests(COLLAPSE_CONTROL_TEST_ID, dataTest)}>
      {/* eslint-disable-next-line */}
      {cloneElement<any>(child, {
        onClick: setCollapsed,
        'aria-controls': `collapse-content-${id}`,
        'aria-expanded': String(!collapsed),
      })}
    </p>
  );
};

export default CollapseControl;
