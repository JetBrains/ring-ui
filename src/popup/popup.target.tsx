import {createContext, type HTMLAttributes, type Ref, type ReactNode} from 'react';

interface ComplexConfig {
  target: string | Element | undefined;
  cssPositioning?: boolean;
}

export const PopupTargetContext = createContext<string | Element | undefined | ComplexConfig>(undefined);
export interface PopupTargetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  ref?: Ref<HTMLDivElement>;
  id: string;
  children: ReactNode | ((target: ReactNode) => ReactNode);
}

export function normalizePopupTarget(
  value: string | Element | undefined | ComplexConfig,
): string | Element | undefined {
  return typeof value === 'string' || value instanceof Element ? value : value?.target;
}

export function PopupTarget({ref, id, children, ...restProps}: PopupTargetProps) {
  const target = (
    <div {...restProps} data-portaltarget={id} ref={ref}>
      {typeof children !== 'function' && children}
    </div>
  );
  return (
    <PopupTargetContext value={id}>{typeof children === 'function' ? children(target) : target}</PopupTargetContext>
  );
}
