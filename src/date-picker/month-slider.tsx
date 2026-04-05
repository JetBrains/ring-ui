import {useCallback, useMemo, useState, type PointerEvent} from 'react';
import classNames from 'classnames';
import {addYears} from 'date-fns/addYears';
import {startOfYear} from 'date-fns';

import units from './consts';
import scheduleRAF from '../global/schedule-raf';

import styles from './date-picker.css';

const scheduleScroll = scheduleRAF();

export default function MonthSlider({
  scrollDate,
  onScroll,
}: {
  scrollDate: number | Date;
  onScroll: (to: number) => void;
}) {
  const [dragStart, setDragStart] = useState<[y: number, scrollDate: number] | null>(null);

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      setDragStart([e.screenY, Number(scrollDate)]);
    },
    [scrollDate],
  );

  const onPointerUp = useCallback(() => {
    setDragStart(null);
  }, []);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      scheduleScroll(() => {
        if (!dragStart) return;
        const [startY, startDate] = dragStart;

        const yearFraction = (e.screenY - startY) / units.calHeight;
        const startDatePlusOneYear = Number(addYears(new Date(startDate), 1));
        const newScrollDate = startDate + yearFraction * (startDatePlusOneYear - startDate);
        onScroll(newScrollDate);
      });
    },
    [onScroll, dragStart],
  );

  const offsets = useMemo(() => {
    const yearStart = startOfYear(scrollDate);
    const yearEnd = addYears(yearStart, 1);
    const yearFraction = (Number(scrollDate) - Number(yearStart)) / (Number(yearEnd) - Number(yearStart));
    return [yearFraction - 1, yearFraction, yearFraction + 1];
  }, [scrollDate]);

  return (
    <div>
      {offsets.map(offset => (
        <button
          type='button'
          key={Math.floor(offset)}
          className={classNames(styles.monthSlider, dragStart && styles.dragging)}
          style={{
            top: offset * units.calHeight - units.cellSize,
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerMove={onPointerMove}
        />
      ))}
    </div>
  );
}
