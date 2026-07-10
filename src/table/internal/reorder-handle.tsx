import {type ComponentPropsWithRef, type Context, type PointerEvent, use, useCallback, useRef} from 'react';
import classNames from 'classnames';
import dragIcon from '@jetbrains/icons/drag-12px';

import {type TableProps} from '../table-props';
import {TablePropsContext} from '../table-const';
import {type ExpectColumnReorder} from './column-animation';
import Icon from '../../icon';
import {useComposedRef} from '../../global/compose-refs';
import {useReorder} from './use-reorder';

import styles from '../table.css';

export function ReorderHandle<T>({
  direction,
  index,
  expectReorder,
  ref: userRef,
  className,
  onKeyDown: userOnKeyDown,
  onPointerDown: userOnPointerDown,
  onPointerMove: userOnPointerMove,
  onPointerUp: userOnPointerUp,
  onPointerCancel: userOnPointerCancel,
  onLostPointerCapture: userOnLostPointerCapture,
  ...restProps
}: {
  direction: 'columns' | 'items';
  index: number;
  expectReorder?: ExpectColumnReorder;
} & ComponentPropsWithRef<'button'>) {
  const localRef = useRef<HTMLButtonElement | null>(null);
  const composedRef = useComposedRef(localRef, userRef);

  const {onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onLostPointerCapture, onKeyDown} = useReorder({
    direction,
    ref: localRef,
    index,
    expectReorder,
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      userOnKeyDown?.(e);
      if (!e.defaultPrevented) onKeyDown(e);
    },
    [onKeyDown, userOnKeyDown],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      userOnPointerDown?.(e);
      if (!e.defaultPrevented) onPointerDown(e);
    },
    [onPointerDown, userOnPointerDown],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      userOnPointerMove?.(e);
      if (!e.defaultPrevented) onPointerMove(e);
    },
    [onPointerMove, userOnPointerMove],
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      userOnPointerUp?.(e);
      if (!e.defaultPrevented) onPointerUp(e);
    },
    [onPointerUp, userOnPointerUp],
  );

  const handlePointerCancel = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      userOnPointerCancel?.(e);
      if (!e.defaultPrevented) onPointerCancel();
    },
    [onPointerCancel, userOnPointerCancel],
  );

  const handleLostPointerCapture = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      userOnLostPointerCapture?.(e);
      if (!e.defaultPrevented) onLostPointerCapture();
    },
    [onLostPointerCapture, userOnLostPointerCapture],
  );

  const tableProps = use(TablePropsContext as Context<TableProps<T> | null>);
  const columns = tableProps?.columns;

  const isColumn = direction === 'columns';
  const hint = isColumn
    ? `Reorder column ${columns?.[index]?.name ?? String(columns?.[index]?.key)}.`
    : `Reorder item ${index}.`;
  const description = isColumn
    ? 'Use Left and Right arrow keys to move the column.'
    : 'Use Up and Down arrow keys to move the item.';
  const shortcuts = isColumn ? 'ArrowLeft ArrowRight' : 'ArrowUp ArrowDown';

  return (
    // eslint-disable-next-line jsx-a11y/role-supports-aria-props
    <button
      ref={composedRef}
      type='button'
      className={classNames(
        styles.tableButton,
        isColumn ? styles.columnReorderHandle : styles.itemReorderHandle,
        className,
      )}
      aria-label={hint}
      aria-description={description}
      aria-keyshortcuts={shortcuts}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handleLostPointerCapture}
      {...restProps}
    >
      <Icon glyph={dragIcon} aria-hidden='true' />
    </button>
  );
}
