import {type Ref} from 'react';
import memoizeOne from 'memoize-one';

function composeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (value: T | null) =>
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }
    });
}

export function createComposedRef<T>() {
  return memoizeOne(composeRefs<T>);
}
