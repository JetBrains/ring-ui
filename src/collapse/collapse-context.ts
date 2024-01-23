import {createContext} from 'react';

import {BASE_ANIMATION_DURATION} from './consts';

interface CollapseContextInterface {
  collapsed: boolean;
  duration: number;
  setCollapsed: () => void;
  onChange: (collapsed: boolean) => void;
  id: string;
}

export const CollapseContext = createContext<CollapseContextInterface>({
  collapsed: true,
  duration: BASE_ANIMATION_DURATION,
  setCollapsed: () => {},
  onChange: () => {},
  id: ''
});

export default CollapseContext;
