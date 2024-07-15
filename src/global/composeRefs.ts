import {Ref, MutableRefObject} from 'react';
import memoizeOne from 'memoize-one';
import deprecate from 'util-deprecate';

function composeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (value: T | null) => refs.forEach(ref => {
    if (typeof ref === 'function') {
      ref(value);
    } else if (ref != null) {
      (ref as MutableRefObject<T | null>).current = value;
    }
  });
}

// TODO remove export in 7.0, composeRefs should be used only in createComposedRef and in useComposedRefs in the future
export default deprecate(composeRefs, 'composeRefs is deprecated and will be removed in 7.0. Use createComposedRef instead.');

export function createComposedRef<T>() {
  return memoizeOne(composeRefs<T>);
}
