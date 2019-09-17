import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import InputNg from '../input-ng/input-ng';
import SelectNg from '../select-ng/select-ng';

import AutofocusNG from './autofocus-ng';

export default {
  title: 'Legacy Angular|Autofocus Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes:
      'Sets focus to the element if the condition is true. Supports standard input elements as well as Select.',
    hermione: {skip: true}
  }
};

export const autofocusOnInput = () => {
  angular.module(APP_NAME, [AutofocusNG, InputNg]);

  return `
      <rg-input
        rg-autofocus="true"
        size="M"
        placeholder="Should be focused"
      ></rg-input>
    `;
};

autofocusOnInput.story = {
  name: 'autofocus on input'
};

export const autofocusOnSelect = () => {
  angular.module(APP_NAME, [AutofocusNG, SelectNg]);

  return '<rg-select options="item in []" size="M" rg-autofocus="true"></rg-select>';
};

autofocusOnSelect.story = {
  name: 'autofocus on select'
};
