import {useCallback, useLayoutEffect, useRef} from 'react';

export default function useEventCallback<I extends unknown[], O>(fn: (...args: I) => O): (...args: I) => O {
  const ref = useRef<(...args: I) => O>(null);
  useLayoutEffect(() => {
    ref.current = fn;
  });
  return useCallback((...args) => {
    const {current} = ref;

    if (current == null) {
      throw new Error('callback created in useEventCallback can only be called from event handlers');
    }

    return current(...args);
  }, []);
}
