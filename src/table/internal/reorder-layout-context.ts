import {createContext, useCallback, useMemo, useRef} from 'react';

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
    insertionIndex: number;
    after: boolean;
  };
}

export const ReorderLayoutContext = createContext<ReorderLayoutContextValue>({
  registerReorderItem: () => () => {},
  getItemBounds: () => undefined,
  getClosestInsertionPoint: () => ({insertionIndex: -1, after: false}),
});

export function useReorderLayoutContextValue(): ReorderLayoutContextValue {
  const getBoundsByInsertionIndex = useRef<(() => ItemBounds)[]>([]);

  const registerReorderItem = useCallback((index: number, getBounds: () => ItemBounds) => {
    getBoundsByInsertionIndex.current[index] = getBounds;
    return () => {
      delete getBoundsByInsertionIndex.current[index];
    };
  }, []);

  const getItemBounds = useCallback((index: number) => {
    const getBounds = getBoundsByInsertionIndex.current[index];
    return getBounds ? getBounds() : undefined;
  }, []);

  const getClosestInsertionPoint = useCallback(
    (clientOffset: number, canReorder: (insertionIndex: number) => boolean) => {
      interface InsertionPointFull {
        insertionIndex: number;
        getBounds: () => ItemBounds;
        beforeAllowed: boolean;
        afterAllowed: boolean;
        distance?: number;
        after?: boolean;
      }

      const insertionPointsFull: InsertionPointFull[] = getBoundsByInsertionIndex.current
        .map((getBounds, insertionIndex) => ({
          insertionIndex,
          getBounds,
          beforeAllowed: canReorder(insertionIndex),
          afterAllowed: canReorder(insertionIndex + 1),
          distance: undefined,
          after: undefined,
        }))
        .filter(({beforeAllowed, afterAllowed}) => beforeAllowed || afterAllowed);

      if (!insertionPointsFull.length) return {insertionIndex: -1, after: false};

      function calculateFullPoint(i: number): Required<InsertionPointFull> {
        if (insertionPointsFull[i].distance == null) {
          const {getBounds, beforeAllowed, afterAllowed} = insertionPointsFull[i];
          const {start, end} = getBounds();
          const beforeDistance = Math.abs(clientOffset - start);
          const afterDistance = Math.abs(clientOffset - end);
          if (!afterAllowed) {
            insertionPointsFull[i].distance = beforeDistance;
            insertionPointsFull[i].after = false;
          } else if (!beforeAllowed) {
            insertionPointsFull[i].distance = afterDistance;
            insertionPointsFull[i].after = true;
          } else {
            const after = afterDistance < beforeDistance;
            insertionPointsFull[i].distance = after ? afterDistance : beforeDistance;
            insertionPointsFull[i].after = after;
          }
        }
        return insertionPointsFull[i] as Required<InsertionPointFull>;
      }

      function toInsertionPoint(fullPoint: Required<InsertionPointFull>): {insertionIndex: number; after: boolean} {
        return {insertionIndex: fullPoint.insertionIndex, after: fullPoint.after};
      }

      let l = 0;
      let r = insertionPointsFull.length - 1;
      while (l < r) {
        const m = Math.floor((l + r) / 2);
        const {distance: mDistance} = calculateFullPoint(m);
        const stepLeft = m - 1;
        if (stepLeft >= l) {
          const {distance: stepLeftDistance} = calculateFullPoint(stepLeft);
          if (stepLeftDistance < mDistance) {
            r = stepLeft;
            continue;
          }
        }
        const stepRight = m + 1;
        if (stepRight <= r) {
          const {distance: stepRightDistance} = calculateFullPoint(stepRight);
          if (stepRightDistance < mDistance) {
            l = stepRight;
            continue;
          }
        }
        return toInsertionPoint(calculateFullPoint(m));
      }

      return toInsertionPoint(calculateFullPoint(l));
    },
    [],
  );

  return useMemo(
    () => ({registerReorderItem, getItemBounds, getClosestInsertionPoint}),
    [registerReorderItem, getItemBounds, getClosestInsertionPoint],
  );
}
