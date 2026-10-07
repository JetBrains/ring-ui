import {Fragment, type ReactNode, useEffect, useRef, useState} from 'react';
import * as React from 'react';
import classNames from 'classnames';

import {isArray} from '../global/typescript-utils';
import Shortcuts from '../shortcuts/shortcuts';
import getUID from '../global/get-uid';
import {type ShortcutsMap} from '../shortcuts/core';
import {adjustValues, calculateMarks, calculateValue, HUNDRED, toPercent, toRange, validateValue} from './slider.utils';
import useEventCallback from '../global/use-event-callback';

import styles from './slider.css';

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
  const activePointer = useRef<number | null>(null);
  const [values, setValues] = useState(defaultValue ?? min);
  const validValues: number[] = toRange(value ?? values, min, max);
  const validStep = step < 0 ? 0 : step;
  const isRange = isArray(defaultValue ?? value);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(-1);
  const [focused, setFocused] = useState(false);
  const [shortcutsScope] = useState(getUID('ring-slider-'));

  const markValues: Mark[] = (() => {
    if (isArray(marks)) {
      return marks.map(mark => ({...mark, value: validateValue(mark.value, min, max)}));
    }
    if (marks) {
      return calculateMarks(min, max, validStep);
    }
    return [];
  })();

  const tickMarks: Mark[] = (() => {
    if (showTicks) {
      return markValues.length ? markValues : calculateMarks(min, max, validStep);
    }
    return [];
  })();

  const trackStart = toPercent(isRange ? Math.min(...validValues) : min, min, max);
  const trackLength = toPercent(Math.max(...validValues), min, max) - trackStart;

  const handleValueChange = (nextValues: number[]) => {
    setValues(nextValues);
    onChange?.(isRange ? nextValues : nextValues[0]);
  };

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

  const shortcutsMap: ShortcutsMap = {};

  if (!disabled) {
    shortcutsMap.left = shortcutsMap.down = ({target}: KeyboardEvent) => {
      const index = getIndex(target);
      setValueAndSwap(Math.max(min, validValues[index] - validStep), index);
    };
    shortcutsMap.right = shortcutsMap.up = ({target}: KeyboardEvent) => {
      const index = getIndex(target);
      setValueAndSwap(Math.min(max, validValues[index] + validStep), index);
    };
    shortcutsMap.home = ({target}: KeyboardEvent) => {
      const index = getIndex(target);
      setValueAndSwap(min, index);
    };
    shortcutsMap.end = ({target}: KeyboardEvent) => {
      const index = getIndex(target);
      setValueAndSwap(max, index);
    };
  }

  const stopDragging = useEventCallback(() => {
    const pointerId = activePointer.current;
    activePointer.current = null;
    setDraggedIndex(-1);
    setIsDragging(false);
    if (pointerId !== null && ref.current?.hasPointerCapture(pointerId)) {
      ref.current.releasePointerCapture(pointerId);
    }
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (disabled || e.button !== 0 || !e.isPrimary || activePointer.current !== null) {
      return;
    }

    const index = e.currentTarget.getAttribute('data-index');
    const nextValue = calculateValue(ref, e.clientX, min, max, validStep);
    if (nextValue !== null && !isNaN(nextValue) && !index) {
      const rangeIndex = Number(Math.abs(validValues[0] - nextValue) > Math.abs(validValues[1] - nextValue));
      setDraggedIndex(isRange ? rangeIndex : 0);
    } else {
      setDraggedIndex(Number(index));
    }
    activePointer.current = e.pointerId;
    ref.current?.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || activePointer.current !== e.pointerId) {
      return;
    }
    const nextValues = adjustValues(validValues, ref, draggedIndex, e.clientX, max, min, validStep);
    if (nextValues[0] > nextValues[1]) {
      nextValues.reverse();
    }
    handleValueChange(nextValues);
    stopDragging();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || activePointer.current !== e.pointerId) {
      return;
    }
    const nextValues = adjustValues(validValues, ref, draggedIndex, e.clientX, max, min, validStep);
    if (nextValues[0] > nextValues[1]) {
      nextValues.reverse();
      setDraggedIndex(prevState => (prevState === 0 ? 1 : 0));
    }
    handleValueChange(nextValues);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointer.current === e.pointerId) {
      stopDragging();
    }
  };

  useEffect(() => {
    if (disabled) {
      stopDragging();
    }
  }, [disabled, stopDragging]);

  return (
    <div
      ref={ref}
      role='presentation' // contains interactive elements
      className={classNames(styles.slider, className, {
        [styles.disabled]: disabled,
        [styles.marked]: !!marks || showTag,
      })}
      tabIndex={-1}
      onMouseDown={e => e.stopPropagation()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handlePointerCancel}
      onFocus={() => setFocused(true)}
      onBlur={e => {
        if (!(e.relatedTarget instanceof Node) || !e.currentTarget.contains(e.relatedTarget)) {
          setFocused(false);
        }
      }}
    >
      <Shortcuts map={shortcutsMap} scope={shortcutsScope} disabled={disabled || !focused} />
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
              onPointerDown={handlePointerDown}
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
