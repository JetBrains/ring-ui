import React from 'react';

import {getTranslations, type Messages} from './i18n';

export const I18nContext = React.createContext<Messages>(getTranslations());
