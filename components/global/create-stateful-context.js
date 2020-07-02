import React, {createContext, memo, useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';

export default function createStatefulContext(initialValue, name = '') {
  const ValueContext = createContext(initialValue);
  const UpdateContext = createContext(() => {});

  function Provider({children}) {
    const [value, update] = useState(initialValue);
    return (
      <ValueContext.Provider value={value}>
        <UpdateContext.Provider value={update}>
          {children}
        </UpdateContext.Provider>
      </ValueContext.Provider>
    );
  }
  Provider.propTypes = {
    children: PropTypes.node
  };
  Provider.displayName = `${name}Provider`;

  function useUpdate(value, skipUpdate) {
    const update = useContext(UpdateContext);
    useEffect(() => {
      if (!skipUpdate) {
        update(value);
      }
    }, [update, value, skipUpdate]);
  }

  function Updater({value, skipUpdate}) {
    useUpdate(value, skipUpdate);

    return null;
  }
  Provider.displayName = `${name}Updater`;

  return {
    ValueContext,
    UpdateContext,
    Provider,
    useUpdate,
    Updater: memo(Updater)
  };
}
