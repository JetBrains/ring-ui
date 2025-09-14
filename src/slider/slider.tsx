import {Fragment, type ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import * as React from 'react';
import classNames from 'classnames';

import {isArray} from '../global/typescript-utils';
import Shortcuts from '../shortcuts/shortcuts';
import getUID from '../global/get-uid';
import {type ShortcutsMap} from '../shortcuts/core';
import styles from './slider.css';
import {adjustValues, calculateMarks, calculateValue, HUNDRED, toPercent, toRange, validateValue} from './slider.utils';

interface Mark {
  value: number;
  label?: ReactNode;
}

interface Props {
  defaultValue?: number | number[];
  value?: number | number[];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  marks?: Mark[] | boolean;
  showTicks?: boolean;
  showTag?: boolean;
  className?: string;
  renderTag?: (value: number) => ReactNode;
  onChange?: (value: number | number[]) => void;
}

export const Slider: React.FC<Props> = ({
  defaultValue,
  value,
  min = 0,
  max = HUNDRED,
  step = 1,
  disabled,
  marks,
  showTicks,
  showTag,
  className,
  renderTag,
  onChange,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const previouslyDragged = useRef(false);
  const [values, setValues] = useState(defaultValue ?? min);
  const validValues: number[] = useMemo(() => toRange(value ?? values, min, max), [max, min, value, values]);
  const validStep = step < 0 ? 0 : step;
  const isRange = isArray(defaultValue ?? value);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(-1);
  const [shortcutsScope] = useState(getUID('ring-slider-'));

  const markValues: Mark[] = useMemo(() => {
    if (isArray(marks)) {
      return marks.map(mark => ({...mark, value: validateValue(mark.value, min, max)}));
    }
    if (marks) {
      return calculateMarks(min, max, validStep);
    }
    return [];
  }, [marks, max, min, validStep]);

  const tickMarks: Mark[] = useMemo(() => {
    if (showTicks) {
      return markValues.length ? markValues : calculateMarks(min, max, validStep);
    }
    return [];
  }, [max, min, markValues, showTicks, validStep]);

  const trackStart = useMemo(
    () => toPercent(isRange ? Math.min(...validValues) : min, min, max),
    [isRange, max, min, validValues],
  );
  const trackLength = useMemo(
    () => toPercent(Math.max(...validValues), min, max) - trackStart,
    [max, min, trackStart, validValues],
  );

  const handleValueChange = useCallback(
    (nextValues: number[]) => {
      setValues(nextValues);
      onChange?.(isRange ? nextValues : nextValues[0]);
    },
    [isRange, onChange],
  );

  const shortcutsMap = useMemo(() => {
    const setValueAndSwap = (nextValue: number, index: number) => {
      const nextValues = [...validValues];
      nextValues[index] = nextValue;
      if (nextValues[0] > nextValues[1]) {
        const previousValue = nextValues[index];
        nextValues.reverse();
        const thumb: HTMLButtonElement | null | undefined = ref.current?.querySelector(
          `[role="slider"][data-index="${nextValues.indexOf(previousValue)}"]`,
        );
        thumb?.focus();
      }
      handleValueChange(nextValues);
    };
    const getIndex = (target: EventTarget | null) => Number((target as Element)?.getAttribute('data-index'));

    const map: ShortcutsMap = {};

    if (!disabled) {
      map.left = map.down = ({target}: KeyboardEvent) => {
        const index = getIndex(target);
        setValueAndSwap(Math.max(min, validValues[index] - validStep), index);
      };
      map.right = map.up = ({target}: KeyboardEvent) => {
        const index = getIndex(target);
        setValueAndSwap(Math.min(max, validValues[index] + validStep), index);
      };
      map.home = ({target}: KeyboardEvent) => {
        const index = getIndex(target);
        setValueAndSwap(min, index);
      };
      map.end = ({target}: KeyboardEvent) => {
        const index = getIndex(target);
        setValueAndSwap(max, index);
      };
    }
    return map;
  }, [disabled, handleValueChange, max, min, validStep, validValues]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      const index = e.currentTarget.getAttribute('data-index');
      const nextValue = calculateValue(ref, e.pageX, min, max, validStep);
      if (nextValue && !isNaN(nextValue) && !index) {
        const rangeIndex = Number(Math.abs(validValues[0] - nextValue) > Math.abs(validValues[1] - nextValue));
        setDraggedIndex(isRange ? rangeIndex : 0);
      } else {
        setDraggedIndex(Number(index));
      }
      setIsDragging(true);
      previouslyDragged.current = false;
    },
    [disabled, isRange, max, min, validStep, validValues],
  );

  const handleMouseUp = useCallback(
    ({pageX}: MouseEvent) => {
      const nextValues = adjustValues(validValues, ref, draggedIndex, pageX, max, min, validStep);
      if (nextValues[0] > nextValues[1]) {
        nextValues.reverse();
      }
      handleValueChange(nextValues);
      setDraggedIndex(-1);
      setIsDragging(false);
      previouslyDragged.current = true;
    },
    [validValues, draggedIndex, handleValueChange, max, min, validStep],
  );

  const handleMouseMove = useCallback(
    ({pageX}: MouseEvent) => {
      const nextValues = adjustValues(validValues, ref, draggedIndex, pageX, max, min, validStep);
      if (nextValues[0] > nextValues[1]) {
        nextValues.reverse();
        setDraggedIndex(prevState => (prevState === 0 ? 1 : 0));
      }
      handleValueChange(nextValues);
    },
    [validValues, draggedIndex, max, min, validStep, handleValueChange],
  );

  useEffect(() => {
    if (disabled) {
      return undefined;
    }

    if (isDragging && !previouslyDragged.current) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else if (!isDragging && previouslyDragged.current) {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, disabled]);

  return (
    <div
      ref={ref}
      role='presentation' // contains interactive elements
      className={classNames(styles.slider, className, {
        [styles.disabled]: disabled,
        [styles.marked]: !!marks || showTag,
      })}
      tabIndex={-1}
      onMouseDown={handleMouseDown}
    >
      <Shortcuts map={shortcutsMap} scope={shortcutsScope} />
      <div
        className={classNames(styles.rail, {
          [styles.rounded]: !showTicks,
          [styles.disabled]: disabled,
        })}
      />
      <div
        style={{
          left: `${trackStart}%`,
          width: `${trackLength}%`,
        }}
        className={classNames(styles.track, {
          [styles.rounded]: !showTicks,
          [styles.disabled]: disabled,
        })}
      />
      {validValues.map((numValue, index) => {
        const percent = toPercent(numValue, min, max);
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={index}>
            <div
              tabIndex={0}
              aria-label='Pick value'
              role='slider'
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={numValue}
              data-index={index}
              style={{left: `${percent}%`}}
              className={classNames(styles.thumb, {
                [styles.disabled]: disabled,
                [styles.dragged]: isDragging && draggedIndex === index,
              })}
              onMouseDown={handleMouseDown}
            />
            {showTag && (
              <div
                style={{left: `${percent}%`}}
                className={classNames(styles.tag, {[styles.disabled]: disabled})}
                role='tooltip'
              >
                {renderTag ? renderTag(numValue) : numValue}
              </div>
            )}
          </Fragment>
        );
      })}
      {markValues.map(({value: markValue, label}, index) => {
        const percent = toPercent(markValue, min, max);
        return (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            style={{left: `${percent}%`}}
            className={classNames(styles.markValue, {[styles.disabled]: disabled})}
          >
            {label ?? markValue}
          </div>
        );
      })}
      {tickMarks.map(({value: tickValue}, index) => {
        const percent = toPercent(tickValue, min, max);
        const isActive = isRange
          ? tickValue >= validValues[0] && tickValue <= validValues[validValues.length - 1]
          : tickValue <= validValues[0];
        return (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className={classNames(styles.tick, {
              [styles.active]: isActive,
              [styles.disabled]: disabled,
            })}
            style={{left: `${percent}%`}}
          />
        );
      })}
    </div>
  );
};
