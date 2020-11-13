import React, {createContext, forwardRef} from 'react';
import PropTypes from 'prop-types';

export const PopupTargetContext = createContext();
export const PopupTarget = forwardRef(
  function PopupTarget({id, children, ...restProps}, ref) {
    const isFunctionChild = typeof children === 'function';
    const target = (
      <div
        {...restProps}
        data-portaltarget={id}
        ref={ref}
      >
        {!isFunctionChild && children}
      </div>
    );
    return (
      <PopupTargetContext.Provider value={id}>
        {isFunctionChild ? children(target) : target}
      </PopupTargetContext.Provider>
    );
  }
);
PopupTarget.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
};
