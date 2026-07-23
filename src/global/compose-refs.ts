import {useMemo, type Ref, type RefObject} from 'react';
import memoizeOne from 'memoize-one';

function composeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (value: T | null) => {
    const cleanups: (() => void)[] = [];
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        const cleanup = ref(value);
        if (typeof cleanup === 'function') {
          cleanups.push(cleanup);
        }
      } else if (ref) {
        (ref as RefObject<T | null>).current = value;
      }
    });
    return () => cleanups.forEach(cleanup => cleanup());
  };
}

export function createComposedRef<T>() {
  return memoizeOne(composeRefs<T>);
}

export function useComposedRef<T>(...refs: (Ref<T> | undefined)[]): Ref<T> {
  /**
   * The React Compiler doesn't allow non-literal arrays in useMemo
   * dependency lists, so we still use memoizeOne under the hood.
   */
  const composer = useMemo(() => createComposedRef<T>(), []);
  return composer(...refs);
}
