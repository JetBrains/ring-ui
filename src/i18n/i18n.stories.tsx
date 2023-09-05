import React from 'react';

import {Story} from '@storybook/react';


import reactDecorator from '../../.storybook/react-decorator';

import {getTranslations, type Messages} from './i18n';
import {I18nContext, I18nContextHolder} from './i18n-context';

const I18nTestComponent: React.FC<Messages> = props => (
  <I18nContextHolder messages={props}>
    <I18nContext.Consumer>
      {({messages, translate}) => (
        Object.keys(messages).map(key => (
          <div key={key}>{key}: {translate(key as keyof Messages)}</div>
        ))
      )}
    </I18nContext.Consumer>
  </I18nContextHolder>
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
