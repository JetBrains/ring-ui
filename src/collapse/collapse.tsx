import {type PropsWithChildren, useId, useState} from 'react';
import * as React from 'react';

import {CollapseContext} from './collapse-context';
import {BASE_ANIMATION_DURATION} from './consts';

interface Props {
  onChange?: (collapsed: boolean) => void;
  duration?: number;
  disableAnimation?: boolean;
  /**
   * Keep children mounted while collapsed (hidden via `visibility: hidden`
   * and the `inert` attribute) instead of unmounting them, preserving their state.
   * Note: hidden form controls still participate in form validation
   * and submission — disable them while collapsed if needed.
   * Content rendered through portals (e.g. Popup) escapes the hidden
   * wrapper and is not hidden — close overlays on collapse.
   */
  keepMounted?: boolean;
  className?: string;
  defaultCollapsed?: boolean;
  collapsed?: boolean | null;
}

/**
 * @name Collapse
 */

export const Collapse: React.FC<PropsWithChildren<Props>> = ({
  children,
  duration = BASE_ANIMATION_DURATION,
  disableAnimation = false,
  keepMounted = false,
  className = '',
  onChange = () => {},
  defaultCollapsed = true,
  collapsed = null,
}) => {
  const [innerCollapsed, setInnerCollapsed] = useState(defaultCollapsed);
  const id = useId();

  const finalCollapsedValue = collapsed ?? innerCollapsed;

  const setCollapsed = () => {
    setInnerCollapsed(!finalCollapsedValue);
    onChange(!finalCollapsedValue);
  };

  return (
    <div className={className}>
      <CollapseContext.Provider
        value={{
          collapsed: finalCollapsedValue,
          setCollapsed,
          duration,
          disableAnimation,
          keepMounted,
          id,
        }}
      >
        {children}
      </CollapseContext.Provider>
    </div>
  );
};

export default Collapse;
