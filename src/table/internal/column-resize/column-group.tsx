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
  return (
    <colgroup>
      {columns.map((column, index) => (
        <col key={column.key} style={{width: widths[index]}} />
      ))}
      {/* Filler, used while the user shrinks a column, see `startColumnResizeDrag` */}
      <col style={{width: 0}} />
    </colgroup>
  );
}
