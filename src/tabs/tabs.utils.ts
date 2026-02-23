import type {ReactElement} from 'react';
import type {TabProps} from './tab';

export const getTabId = (tab: ReactElement<TabProps> | undefined, index: number) => tab?.props.id || String(index);
