import {createContext, memo, useContext, useEffect, useState, ReactNode} from 'react';

type Update<T> = (value: T) => void;
export interface ProviderProps {
  children: ReactNode;
}
export interface UpdaterProps<T> {
  value: T;
  skipUpdate?: boolean;
}

export default function createStatefulContext<T>(initialValue: T, name = '') {
  const ValueContext = createContext(initialValue);
  const UpdateContext = createContext<Update<T>>(() => {});

  function Provider({children}: ProviderProps) {
    const [value, update] = useState(initialValue);
    return (
      <ValueContext.Provider value={value}>
        <UpdateContext.Provider value={update}>{children}</UpdateContext.Provider>
      </ValueContext.Provider>
    );
  }
  Provider.displayName = `${name}Provider`;

  function useUpdate(value: T, skipUpdate?: boolean) {
    const update = useContext(UpdateContext);
    useEffect(() => {
      if (!skipUpdate) {
        update(value);
      }
    }, [update, value, skipUpdate]);
  }

  function Updater({value, skipUpdate}: UpdaterProps<T>) {
    useUpdate(value, skipUpdate);

    return null;
  }
  Updater.displayName = `${name}Updater`;

  return {
    ValueContext,
    UpdateContext,
    Provider,
    useUpdate,
    Updater: memo(Updater),
  };
}
