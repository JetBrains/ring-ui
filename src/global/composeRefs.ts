import {Ref, MutableRefObject} from 'react';
import memoizeOne from 'memoize-one';

export default function composeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (value: T | null) => refs.forEach(ref => {
    if (typeof ref === 'function') {
      ref(value);
    } else if (ref != null) {
      (ref as MutableRefObject<T | null>).current = value;
    }
  });
}

export function createComposedRef<T>() {
  return memoizeOne(composeRefs<T>);
}
