import React, {createContext, forwardRef, HTMLAttributes, Ref, ReactNode} from 'react';
import PropTypes from 'prop-types';

export const PopupTargetContext = createContext<string | undefined>(undefined);
export interface PopupTargetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  id: string
  children: ReactNode | ((target: ReactNode) => ReactNode)
}
export const PopupTarget = forwardRef(
  function PopupTarget({id, children, ...restProps}: PopupTargetProps, ref: Ref<HTMLDivElement>) {
    const target = (
      <div
        {...restProps}
        data-portaltarget={id}
        ref={ref}
      >
        {typeof children !== 'function' && children}
      </div>
    );
    return (
      <PopupTargetContext.Provider value={id}>
        {typeof children === 'function' ? children(target) : target}
      </PopupTargetContext.Provider>
    );
  }
);
PopupTarget.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
};
