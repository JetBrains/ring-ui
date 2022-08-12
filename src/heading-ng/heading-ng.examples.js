import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import Heading from '../heading/heading';

import HeadingNG from './heading-ng';

export default {
  title: 'Legacy Angular/Heading Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for Heading.',
    hermione: {skip: true}
  }
};

export const basic = () => {
  angular.module(APP_NAME, [HeadingNG]);

  return `
      <rg-heading level="${Heading.Levels.H1}">Heading 1</rg-heading>
      <rg-heading level="${Heading.Levels.H2}">Heading 2</rg-heading>
      <rg-heading level="${Heading.Levels.H3}">Heading 3</rg-heading>
      <rg-heading level="${Heading.Levels.H4}">Heading 4</rg-heading>
    `;
};

basic.storyName = 'Heading Ng';
