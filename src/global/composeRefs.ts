import {Ref, MutableRefObject} from 'react';

export default <T>(...refs: (Ref<T> | undefined)[]) => (value: T | null) => refs.forEach(ref => {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref != null) {
    (ref as MutableRefObject<T | null>).current = value;
  }
});
