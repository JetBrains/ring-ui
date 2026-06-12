import {useCallback, useLayoutEffect, useRef} from 'react';

/**
 * @deprecated This hook will be removed in Ring UI 8.0. Use `useEffectEvent()` instead.
 */
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
