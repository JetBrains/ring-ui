import {type PointerEvent, use, useEffect, useRef} from 'react';
import {flushSync} from 'react-dom';

import {type Column} from '../../table-props';
import {ColumnSizingContext} from './column-sizing-context';
import {startColumnResizeDrag} from './column-resize-drag';

import styles from '../../table.css';

export function ColumnResizeHandle<T>({column, columnIndex}: {column: Column<T>; columnIndex: number}) {
  const {freezeWidths, commitWidth} = use(ColumnSizingContext);
  const cancelDragRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cancelDragRef.current?.(), []);

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 || !e.isPrimary || cancelDragRef.current) return;
    const startWidths = flushSync(freezeWidths);
    if (!startWidths) return;

    e.preventDefault();
    e.stopPropagation();

    cancelDragRef.current = startColumnResizeDrag({
      handle: e.currentTarget,
      pointerId: e.pointerId,
      clientX: e.clientX,
      columnIndex,
      startWidths,
      minWidth: column.minWidth,
      maxWidth: column.maxWidth,
      onCommit: newWidth => commitWidth(column.key, newWidth),
      onEnd: () => {
        cancelDragRef.current = null;
      },
    });
  }

  return (
    <div
      aria-hidden
      data-test='ring-table-column-resize-handle'
      className={styles.columnResizeHandle}
      onPointerDown={handlePointerDown}
      // Prevents the header tap from toggling column editing mode
      onClick={e => e.stopPropagation()}
    />
  );
}
