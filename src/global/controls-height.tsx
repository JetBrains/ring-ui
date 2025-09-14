import {createContext} from 'react';
import deprecate from 'util-deprecate';

import {configure, ControlsHeight, getConfiguration} from './configuration';

export {ControlsHeight} from './configuration';

// This can be used if React Context is not applicable, for example for alertService or Auth dialog
export const configureGlobalControlsHeight = deprecate((value: ControlsHeight) => {
  configure({controlsHeight: value});
}, 'Ring UI: configureGlobalControlsHeight() is deprecated, use configure() instead');

export function getGlobalControlsHeight() {
  return getConfiguration().controlsHeight ?? ControlsHeight.M;
}

export const ControlsHeightContext = createContext<ControlsHeight |(() => ControlsHeight)>(getGlobalControlsHeight);
