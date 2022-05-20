import {createContext} from 'react';

export enum ControlsHeight {
  S = 'S',
  M = 'M',
  L = 'L'
}

export const ControlsHeightContext = createContext(ControlsHeight.M);
