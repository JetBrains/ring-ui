import {type PointerEvent, use, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {flushSync} from 'react-dom';

import {type Column} from '../../table-props';
import {ColumnSizingContext} from './column-sizing-context';
import {startColumnResizeDrag} from './column-resize-drag';
import {createColumnResizeIndicator} from './column-resize-indicator';

import styles from '../../table.css';

export function ColumnResizeHandle<T>({column, columnIndex}: {column: Column<T>; columnIndex: number}) {
  const {freezeWidths, commitWidth} = use(ColumnSizingContext);
  const handleRef = useRef<HTMLDivElement>(null);
  const cancelDragRef = useRef<(() => void) | null>(null);
  // Shared by hover and drag, so that there is never more than one line
  const [indicator] = useState(createColumnResizeIndicator);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(
    () => () => {
      cancelDragRef.current?.();
      indicator.remove();
    },
    [indicator],
  );

  // While hovered, follows the column edge: after rendering a committed width, and when the table scrolls.
  // The drag positions the indicator itself.
  useLayoutEffect(() => {
    const th = handleRef.current?.closest('th');
    if (!hovered || dragging || !th) {
      if (!dragging) indicator.remove();
      return undefined;
    }

    const update = () => indicator.position(th);
    update();
    document.addEventListener('scroll', update, {capture: true, passive: true});
    return () => document.removeEventListener('scroll', update, {capture: true});
  });

  function handlePointerEnter(e: PointerEvent<HTMLDivElement>) {
    // On touch screens, there is no hover. A tap would only flash the line.
    if (e.pointerType !== 'touch') setHovered(true);
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 || !e.isPrimary || cancelDragRef.current) return;
    const startWidths = flushSync(freezeWidths);
    if (!startWidths) return;

    e.preventDefault();
    e.stopPropagation();

    setDragging(true);
    cancelDragRef.current = startColumnResizeDrag({
      handle: e.currentTarget,
      pointerId: e.pointerId,
      clientX: e.clientX,
      columnIndex,
      startWidths,
      minWidth: column.minWidth,
      maxWidth: column.maxWidth,
      indicator,
      onCommit: newWidth => commitWidth(column.key, newWidth),
      onEnd: () => {
        cancelDragRef.current = null;
        setDragging(false);
      },
    });
  }

  return (
    <div
      ref={handleRef}
      aria-hidden
      data-test='ring-table-column-resize-handle'
      className={styles.columnResizeHandle}
      onPointerEnter={handlePointerEnter}
      // During a drag, the pointer is captured, so this fires once the pointer is released outside the handle
      onPointerLeave={() => setHovered(false)}
      onPointerDown={handlePointerDown}
      // Prevents the header tap from toggling column editing mode
      onClick={e => e.stopPropagation()}
    />
  );
}
