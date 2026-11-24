import type {Column} from '../../table-props';

/**
 * Sets the column widths. In fixed layout, header and body cells follow them.
 */
export function ColumnGroup<T>({
  columns,
  widths,
}: {
  columns: readonly Column<T>[];
  widths: readonly (number | undefined)[];
}) {
  const hasFill = columns.some(column => column.fill);
  return (
    <colgroup>
      {columns.map((column, index) => (
        // A fill column has no width, so that it takes what is left in fixed layout
        <col key={column.key} style={{width: column.fill ? undefined : widths[index]}} />
      ))}
      {/* Filler, used while the user shrinks a column, see `startColumnResizeDrag` */}
      {!hasFill && columns.some(column => column.resizable) && <col style={{width: 0}} />}
    </colgroup>
  );
}
