import {createContext} from 'react';

import {BASE_ANIMATION_DURATION} from './consts';

interface CollapseContextInterface {
  collapsed: boolean;
  duration: number;
  animate: boolean;
  disableAnimation: boolean;
  keepMounted?: boolean;
  setCollapsed: () => void;
  id: string;
}

export const CollapseContext = createContext<CollapseContextInterface>({
  collapsed: true,
  duration: BASE_ANIMATION_DURATION,
  animate: false,
  disableAnimation: false,
  keepMounted: false,
  setCollapsed: () => {},
  id: '',
});

export default CollapseContext;
