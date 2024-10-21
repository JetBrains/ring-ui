import {createContext, forwardRef, HTMLAttributes, Ref, ReactNode} from 'react';

export const PopupTargetContext = createContext<string | Element | undefined>(undefined);
export interface PopupTargetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  id: string;
  children: ReactNode | ((target: ReactNode) => ReactNode);
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
