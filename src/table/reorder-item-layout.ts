import {use, useEffect} from 'react';

import {ReorderLayoutContext} from './internal/reorder-layout-context';

/**
 * Registers the physical boundaries of a custom-rendered item with the reorder
 * system, so that the insertion indicator and insertion point calculation are
 * correct for items that span multiple rows or have non-standard sizing.
 *
 * `DefaultItemRenderer` calls this automatically. Use this hook in a custom item
 * renderer when the default boundary measurement is insufficient — for example,
 * when the item spans multiple rows, or when you don't use
 * the `DefaultItemRenderer` at all.
 *
 * If you include `DefaultItemRenderer` inside your custom renderer, set its
 * `noReorderLayout` prop to `true` to prevent double registration.
 */
export function useReorderItemLayout({
  disabled,
  index,
  getBounds,
}: {
  /**
   * When `true`, the item is not registered. Use to disable without violating
   * the rules of hooks.
   */
  disabled?: boolean;
  /**
   * Index of the item in the `data` array.
   */
  index: number;
  /**
   * Returns the item's top and bottom client coordinates (in pixels, relative
   * to the viewport).
   */
  getBounds: () => {start: number; end: number};
}) {
  const {registerReorderItem} = use(ReorderLayoutContext);
  useEffect(() => {
    if (disabled) return;

    return registerReorderItem(index, getBounds);
  }, [index, getBounds, registerReorderItem, disabled]);
}
