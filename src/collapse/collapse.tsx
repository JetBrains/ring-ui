import {PropsWithChildren, useCallback, useId, useState} from 'react';
import * as React from 'react';

import {CollapseContext} from './collapse-context';
import {BASE_ANIMATION_DURATION} from './consts';

type Props = {
  onChange?: (collapsed: boolean) => void;
  duration?: number;
  disableAnimation?: boolean;
  className?: string;
};

/**
 * @name Collapse
 */

export const Collapse: React.FC<PropsWithChildren<Props>> = ({
  children,
  duration = BASE_ANIMATION_DURATION,
  disableAnimation = false,
  className = '',
  onChange = () => {}
}) => {
  const [collapsed, toggle] = useState(true);
  const id = useId();

  const setCollapsed = useCallback(() => {
    toggle(!collapsed);
    onChange(!collapsed);
  }, [toggle, onChange, collapsed]);

  return (
    <div className={className}>
      <CollapseContext.Provider
        value={{
          collapsed,
          setCollapsed,
          duration,
          disableAnimation,
          id
        }}
      >
        {children}
      </CollapseContext.Provider>
    </div>
  );
};

export default Collapse;
