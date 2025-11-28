import {useCallback, useLayoutEffect, useRef} from 'react';

// TODO deprecate in favor of useEffectEvent after dropping support for React < 19.2
export default function useEventCallback<I extends unknown[], O>(fn: (...args: I) => O): (...args: I) => O {
  const ref = useRef<(...args: I) => O>(null);
  useLayoutEffect(() => {
    ref.current = fn;
  });
  return useCallback((...args) => {
    const {current} = ref;

    if (current === null || current === undefined) {
      throw new Error('callback created in useEventCallback can only be called from event handlers');
    }

    return current(...args);
  }, []);
}
