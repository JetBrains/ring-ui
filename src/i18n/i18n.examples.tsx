import React from 'react';

import {Story} from '@storybook/react';


import reactDecorator from '../../.storybook/react-decorator';

import {getTranslations, Messages} from './i18n';
import {I18nContext} from './i18n-context';

const I18nTestComponent: React.FC<Messages> = props => (
  <I18nContext.Provider value={props}>
    <I18nContext.Consumer>
      {messages => (
        Object.entries(messages).map(([key, value]) => (
          <div key={key}>{key}: {value}</div>
        ))
      )}
    </I18nContext.Consumer>
  </I18nContext.Provider>
);

export default {
  title: 'Services/I18n',
  decorators: [reactDecorator()],

  parameters: {
    component: I18nTestComponent,
    framework: 'react'
  },
  args: {
    ...getTranslations()
  }
};

export const basic: Story<Messages> = args => <I18nTestComponent {...args}/>;

basic.storyName = 'basic';
basic.parameters = {hermione: {skip: true}};
