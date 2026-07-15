import {createContext, useRef} from 'react';

interface ItemBounds {
  start: number;
  end: number;
}

interface ReorderLayoutContextValue {
  registerReorderItem(index: number, getBounds: () => ItemBounds): () => void;
  getItemBounds(index: number): ItemBounds | undefined;
  getClosestInsertionPoint(
    clientOffset: number,
    canReorder: (insertionIndex: number) => boolean,
  ): {
    itemIndex: number;
    after: boolean;
  };
}

export const ReorderLayoutContext = createContext<ReorderLayoutContextValue>({
  registerReorderItem: () => () => {},
  getItemBounds: () => undefined,
  getClosestInsertionPoint: () => ({itemIndex: -1, after: false}),
});

export function useReorderLayoutContextValue(): ReorderLayoutContextValue {
  const getBoundsByItemIndex = useRef<(() => ItemBounds)[]>([]);

  function registerReorderItem(index: number, getBounds: () => ItemBounds) {
    getBoundsByItemIndex.current[index] = getBounds;
    return () => {
      delete getBoundsByItemIndex.current[index];
    };
  }

  function getItemBounds(index: number) {
    const getBounds = getBoundsByItemIndex.current[index];
    return getBounds ? getBounds() : undefined;
  }

  function getClosestInsertionPoint(clientOffset: number, canReorder: (insertionIndex: number) => boolean) {
    const candidates = getBoundsByItemIndex.current
      .map((getBounds, itemIndex) => ({
        itemIndex,
        getBounds,
        beforeAllowed: canReorder(itemIndex),
        afterAllowed: canReorder(itemIndex + 1),
      }))
      .filter(({beforeAllowed, afterAllowed}) => beforeAllowed || afterAllowed);

    if (!candidates.length) return {itemIndex: -1, after: false};

    // Lazily computed closest insertion side and distance for each candidate
    const closest: ({distance: number; after: boolean} | undefined)[] = [];

    function computeClosest(i: number) {
      if (!closest[i]) {
        const {getBounds, beforeAllowed, afterAllowed} = candidates[i];
        const {start, end} = getBounds();
        const beforeDist = Math.abs(clientOffset - start);
        const afterDist = Math.abs(clientOffset - end);
        if (!afterAllowed) {
          closest[i] = {distance: beforeDist, after: false};
        } else if (!beforeAllowed) {
          closest[i] = {distance: afterDist, after: true};
        } else {
          const after = afterDist < beforeDist;
          closest[i] = {distance: after ? afterDist : beforeDist, after};
        }
      }
      return closest[i]!;
    }

    let l = 0;
    let r = candidates.length - 1;
    while (l < r) {
      const m = Math.floor((l + r) / 2);
      const {distance} = computeClosest(m);
      if (l <= m - 1 && computeClosest(m - 1).distance < distance) {
        r = m - 1;
      } else if (m + 1 <= r && computeClosest(m + 1).distance < distance) {
        l = m + 1;
      } else {
        return {itemIndex: candidates[m].itemIndex, after: computeClosest(m).after};
      }
    }
    return {itemIndex: candidates[l].itemIndex, after: computeClosest(l).after};
  }

  return {registerReorderItem, getItemBounds, getClosestInsertionPoint};
}
