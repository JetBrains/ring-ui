import React, {PropsWithChildren, useCallback, useId, useState} from 'react';

import {CollapseContext} from './collapse-context';
import {BASE_ANIMATION_DURATION} from './consts';

type Props = {
  onChange?: (collapsed: boolean) => void;
  duration?: number;
  className?: string;
};

/**
 * @name Collapse
 */

export const Collapse: React.FC<PropsWithChildren<Props>> = ({
  children,
  duration = BASE_ANIMATION_DURATION,
  className = '',
  onChange = () => {}
}) => {
  const [collapsed, toggle] = useState(true);
  const id = useId();

  const setCollapsed = useCallback(() => {
    toggle(!collapsed);
  }, [toggle, collapsed]);

  return (
    <div className={className}>
      <CollapseContext.Provider
        value={{
          collapsed,
          setCollapsed,
          duration,
          onChange,
          id
        }}
      >
        {children}
      </CollapseContext.Provider>
    </div>
  );
};

export default Collapse;
