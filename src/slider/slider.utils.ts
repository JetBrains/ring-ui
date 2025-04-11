import {RefObject} from 'react';

import {isArray} from '../global/typescript-utils';

export const HUNDRED = 100;

export function toPercent(value: number, min: number, max: number) {
  return ((value - min) * HUNDRED) / (max - min);
}

function toValue(percent: number, min: number, max: number) {
  return (max - min) * percent + min;
}

function roundToStep(value: number, step: number, min: number) {
  return Math.round((value - min) / step) * step + min;
}

export function calculateValue(
  ref: RefObject<HTMLDivElement | null>,
  x: number,
  min: number,
  max: number,
  step: number,
) {
  if (!ref.current) {
    return null;
  }
  const {width, left} = ref.current.getBoundingClientRect();
  const value = toValue((x - left) / width, min, max);
  const precision = step.toString().split('.')?.[1]?.length;
  return Number(roundToStep(value, step, min).toFixed(precision));
}

export function validateValue(value: number, min: number, max: number) {
  if (value <= min) {
    return min;
  }
  if (value >= max) {
    return max;
  }
  return value;
}

export function toRange(value: number | number[], min: number, max: number) {
  if (isArray(value)) {
    const nextValues = value.slice(0, 2).map(val => validateValue(val, min, max));
    if (nextValues[0] > nextValues[1]) {
      nextValues.reverse();
    }
    return nextValues;
  } else {
    return [validateValue(value, min, max)];
  }
}

export function adjustValues(
  values: number[],
  ref: RefObject<HTMLDivElement | null>,
  index: number,
  x: number,
  max: number,
  min: number,
  step: number,
) {
  const nextValue = calculateValue(ref, x, min, max, step);
  const nextValues = [...values];
  if (nextValue !== null && !isNaN(nextValue)) {
    nextValues[index] = validateValue(nextValue, min, max);
  }
  return nextValues;
}

export function calculateMarks(min: number, max: number, step: number) {
  const numMarks = Math.floor((max - min) / step) + 1;
  return Array.from({length: numMarks}, (_, index) => ({value: validateValue(min + step * index, min, max)}));
}
