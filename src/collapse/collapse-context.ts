import {createContext} from 'react';

import {BASE_ANIMATION_DURATION} from './consts';

interface CollapseContextInterface {
  collapsed: boolean;
  duration: number;
  disableAnimation: boolean;
  setCollapsed: () => void;
  id: string;
}

export const CollapseContext = createContext<CollapseContextInterface>({
  collapsed: true,
  duration: BASE_ANIMATION_DURATION,
  disableAnimation: false,
  setCollapsed: () => {},
  id: '',
});

export default CollapseContext;
