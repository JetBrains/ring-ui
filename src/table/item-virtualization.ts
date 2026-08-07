import {type RefObject, use, useEffect} from 'react';

import {VirtualizationContext} from './internal/virtualization';

/**
 * Use in an item renderer to control item virtualization.
 */
export function useItemVirtualization({
  index,
  refs,
  onIntersectionChange,
}: {
  /**
   * Index of the item.
   */
  index: number;

  /**
   * One or more elements representing this item.
   *
   * When multiple elements are provided, the virtualization callback receives
   * the intersection state of all of them.
   *
   * If you pass multiple refs, pass a stable array reference to avoid restarting
   * observation on every render — for example, memoize it with `useMemo()`,
   * unless you use the React Compiler.
   */
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[];

  /**
   * Invoked when the `isIntersecting` state of the observed elements changes.
   * Pass a stable function reference to avoid restarting observation on every render —
   * for example, wrap it with `useCallback()`, unless you use the React Compiler.
   *
   * @param intersectionStates - Current intersection state of every observed element.
   * Entries are initially `undefined` until the corresponding element
   * has been reported by `IntersectionObserver`.
   * @param changedIndex - Index of the element whose intersection state changed.
   * @param elements - The observed elements. Note that some elements may
   * already be disconnected from the DOM when this callback is invoked.
   * Use additional checks like `element.isConnected`.
   * @returns Return the height of an item to collapse the item into spacer,
   * or `undefined` to keep the item rendered.
   */
  onIntersectionChange: (
    intersectionStates: (boolean | undefined)[],
    changedIndex: number,
    elements: (Element | null)[],
  ) => number | undefined;
}) {
  const {intersectionObserverHandle, collapseItemIntoSpacer} = use(VirtualizationContext);

  useEffect(() => {
    const intersectionStates: (boolean | undefined)[] = Array.isArray(refs) ? refs.map(() => undefined) : [undefined];
    const elements = Array.isArray(refs) ? refs.map(r => r.current) : [refs.current];

    const cleanups: (() => void)[] = [];
    elements.forEach((element, elementIndex) => {
      if (!element) return;

      const cleanup = intersectionObserverHandle.observe(element, isIntersecting => {
        intersectionStates[elementIndex] = isIntersecting;

        const height = onIntersectionChange(intersectionStates, elementIndex, elements);
        if (height != null) {
          collapseItemIntoSpacer(index, height);
        }
      });
      cleanups.push(cleanup);
    });

    return () => cleanups.forEach(cleanup => cleanup());
  }, [collapseItemIntoSpacer, intersectionObserverHandle, index, onIntersectionChange, refs]);
}
