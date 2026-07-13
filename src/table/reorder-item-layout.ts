import {use, useEffect} from 'react';

import {ReorderLayoutContext} from './internal/reorder-layout-context';

export function useReorderItemLayout({
  disabled,
  index,
  getBounds,
}: {
  disabled?: boolean;
  index: number;
  getBounds: () => {start: number; end: number};
}) {
  const {registerReorderItem} = use(ReorderLayoutContext);
  useEffect(() => {
    if (disabled) return;

    return registerReorderItem(index, getBounds);
  }, [index, getBounds, registerReorderItem, disabled]);
}
