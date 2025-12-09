import {createContext, forwardRef, type HTMLAttributes, type Ref, type ReactNode} from 'react';

interface ComplexConfig {
  complex: true; // for simple type narrowing
  target: string | Element | undefined;
  cssPositioning?: boolean;
}

export const PopupTargetContext = createContext<string | Element | undefined | ComplexConfig>(undefined);
export interface PopupTargetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  id: string;
  children: ReactNode | ((target: ReactNode) => ReactNode);
}

export function normalizePopupTarget(
  value: string | Element | undefined | ComplexConfig,
): string | Element | undefined {
  return typeof value === 'string' || value instanceof Element ? value : value?.target;
}

export const PopupTarget = forwardRef(function PopupTarget(
  {id, children, ...restProps}: PopupTargetProps,
  ref: Ref<HTMLDivElement>,
) {
  const target = (
    <div {...restProps} data-portaltarget={id} ref={ref}>
      {typeof children !== 'function' && children}
    </div>
  );
  return (
    <PopupTargetContext.Provider value={id}>
      {typeof children === 'function' ? children(target) : target}
    </PopupTargetContext.Provider>
  );
});
