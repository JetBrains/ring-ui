import {PropsWithChildren, useCallback, useId, useMemo, useState} from 'react';
import * as React from 'react';

import {CollapseContext} from './collapse-context';
import {BASE_ANIMATION_DURATION} from './consts';

type Props = {
  onChange?: (collapsed: boolean) => void;
  duration?: number;
  disableAnimation?: boolean;
  className?: string;
  defaultCollapsed?: boolean;
  collapsed?: boolean | null;
};

/**
 * @name Collapse
 */

export const Collapse: React.FC<PropsWithChildren<Props>> = ({
  children,
  duration = BASE_ANIMATION_DURATION,
  disableAnimation = false,
  className = '',
  onChange = () => {},
  defaultCollapsed = true,
  collapsed = null,
}) => {
  const [innerCollapsed, setInnerCollapsed] = useState(defaultCollapsed);
  const id = useId();

  const finalCollapsedValue = useMemo(() => collapsed ?? innerCollapsed, [innerCollapsed, collapsed]);

  const setCollapsed = useCallback(() => {
    setInnerCollapsed(!finalCollapsedValue);
    onChange(!finalCollapsedValue);
  }, [setInnerCollapsed, onChange, finalCollapsedValue]);

  return (
    <div className={className}>
      <CollapseContext.Provider
        value={{
          collapsed: finalCollapsedValue,
          setCollapsed,
          duration,
          disableAnimation,
          id,
        }}
      >
        {children}
      </CollapseContext.Provider>
    </div>
  );
};

export default Collapse;
