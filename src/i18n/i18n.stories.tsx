import * as React from 'react';

import {StoryFn} from '@storybook/react';

import {getTranslations, type Messages} from './i18n';
import {I18nContext, I18nContextHolder} from './i18n-context';

const I18nTestComponent: React.FC<Messages> = props => (
  <I18nContextHolder messages={props}>
    <I18nContext.Consumer>
      {({messages, translate}) =>
        Object.keys(messages).map(key => (
          <div key={key}>
            {key}: {translate(key as keyof Messages)}
          </div>
        ))
      }
    </I18nContext.Consumer>
  </I18nContextHolder>
);

export default {
  title: 'Services/I18n',

  component: I18nTestComponent,
  args: {
    ...getTranslations(),
  },
};

export const basic: StoryFn<Messages> = args => <I18nTestComponent {...args} />;

basic.storyName = 'basic';
basic.parameters = {screenshots: {skip: true}};
