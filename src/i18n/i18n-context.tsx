import {useEffect} from 'react';
import * as React from 'react';

import {getTranslations, type Messages, setTranslations, translate} from './i18n';

export interface I18nContextProps {
  translate(key: keyof Messages): string;
  messages: Messages;
}

export const I18nContext = React.createContext<I18nContextProps>({
  messages: getTranslations(),
  translate
});


interface I18nContextHolderProps {
  messages: Messages;
  children?: React.ReactNode
}

export const I18nContextHolder: React.FC<I18nContextHolderProps> = ({children, messages}) => {
  useEffect(() => {
    setTranslations(messages);
  }, [messages]);

  return (
    <I18nContext.Provider value={{messages, translate}}>
      {children}
    </I18nContext.Provider>
  );
};
