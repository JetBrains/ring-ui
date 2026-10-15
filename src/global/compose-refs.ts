import {type Ref, type RefCallback} from 'react';
import memoizeOne from 'memoize-one';

function setRef<T>(ref: Ref<T> | undefined, value: T | null): ReturnType<RefCallback<T>> {
  if (typeof ref === 'function') {
    return ref(value);
  }
  if (ref) {
    ref.current = value;
  }
}

function composeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (value: T | null) => {
    const cleanups = refs.map(ref => setRef(ref, value));

    if (cleanups.some(cleanup => typeof cleanup === 'function')) {
      return () => {
        cleanups.forEach((cleanup, index) => {
          if (typeof cleanup === 'function') {
            cleanup();
          } else {
            setRef(refs[index], null);
          }
        });
      };
    }
    return undefined;
  };
}

export function createComposedRef<T>() {
  return memoizeOne(composeRefs<T>);
}
