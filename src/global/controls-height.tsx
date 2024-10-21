import {createContext} from 'react';

export enum ControlsHeight {
  S = 'S',
  M = 'M',
  L = 'L',
}

export const ControlsHeightContext = createContext(ControlsHeight.M);

let globalControlsHeight = ControlsHeight.M;

// This can be used if React Context is not applicable, for example for alertService or Auth dialog
export function configureGlobalControlsHeight(value: ControlsHeight) {
  globalControlsHeight = value;
}

export function getGlobalControlsHeight() {
  return globalControlsHeight;
}
