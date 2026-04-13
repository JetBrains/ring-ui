import {useCallback, useMemo, useRef, useState, type PointerEvent} from 'react';
import classNames from 'classnames';
import {addYears} from 'date-fns/addYears';
import {startOfYear} from 'date-fns';

import units, {type ScrollDate} from './consts';
import scheduleRAF from '../global/schedule-raf';

import styles from './date-picker.css';

const scheduleScroll = scheduleRAF();

export default function MonthSlider({
  scrollDate,
  setScrollDate,
}: {
  scrollDate: ScrollDate;
  setScrollDate: (scrollDate: ScrollDate) => void;
}) {
  const [dragStart, setDragStart] = useState<{y: number; scrollDate: number; pointerId: number} | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      const pointerId = e.pointerId;
      setDragStart({y: e.screenY, scrollDate: Number(scrollDate.date), pointerId});
      buttonRef.current?.setPointerCapture(pointerId);
    },
    [scrollDate],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      scheduleScroll(() => {
        if (!dragStart) return;
        const {y: startY, scrollDate: startDate} = dragStart;

        const yearFraction = (e.screenY - startY) / units.calHeight;
        const startDatePlusOneYear = Number(addYears(new Date(startDate), 1));
        const newScrollDate = startDate + yearFraction * (startDatePlusOneYear - startDate);
        setScrollDate({date: newScrollDate, source: 'other'});
      });
    },
    [setScrollDate, dragStart],
  );

  const onPointerUp = useCallback(() => {
    if (!dragStart) return;

    const {pointerId} = dragStart;
    setDragStart(null);
    buttonRef.current?.releasePointerCapture?.(pointerId);
  }, [dragStart]);

  const offsets = useMemo(() => {
    const yearStart = startOfYear(scrollDate.date);
    const yearEnd = addYears(yearStart, 1);
    const yearFraction = (Number(scrollDate.date) - Number(yearStart)) / (Number(yearEnd) - Number(yearStart));
    return [yearFraction - 1, yearFraction, yearFraction + 1];
  }, [scrollDate]);

  return (
    <div>
      {offsets.map(offset => (
        <button
          ref={buttonRef}
          type='button'
          key={Math.floor(offset)}
          className={classNames(styles.monthSlider, dragStart && styles.dragging)}
          style={{
            top: offset * units.calHeight - units.cellSize,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      ))}
    </div>
  );
}
