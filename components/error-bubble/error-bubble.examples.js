import React, {Component} from 'react';

import reactDecorator from '../../.storybook/react-decorator';
import Select from '../select/select';

import Dialog from '../dialog/dialog';
import {Header, Content} from '../island/island';
import '../form/form.scss';
import '../input-size/input-size.scss';

import ErrorBubble from './error-bubble';

export default {
  title: 'Components|ErrorBubble',
  decorators: [reactDecorator()],

  parameters: {
    notes:
      'Displays an error bubble near the wrapped input component when a non-empty string is passed to the `error` prop. * Passes any prop except `className` down to the input.'
  }
};

export const basic = () => {
  class ErrorBubbleDemo extends Component {
    state = {value: null};

    render() {
      const {value} = this.state;

      return (
        <ErrorBubble
          error={value ? null : 'Value is required'}
          onSelect={selected => this.setState({value: selected})}
          placeholder="enter something"
        >
          <Select
            type={Select.Type.BUTTON}
            size={Select.Size.M}
            data={[{label: 'One'}, {label: 'Two'}]}
          />
        </ErrorBubble>
      );
    }
  }

  return <ErrorBubbleDemo/>;
};

basic.story = {
  name: 'basic'
};

export const inDialogForm = () => {
  class ErrorBubbleDemo extends Component {
    state = {value: null};

    render() {
      const {value} = this.state;

      return (
        <Dialog show>
          <Header>Dialog example</Header>
          <Content>
            <form className="ring-form">
              <div className="ring-form__group">
                <label htmlFor="select" className="ring-form__label">Field name</label>
                <div className="ring-form__control ring-form__control_small">
                  <ErrorBubble
                    error={value ? null : 'Value is required'}
                    onSelect={selected => this.setState({value: selected})}
                    placeholder="enter something"
                  >
                    <Select
                      id="select"
                      type={Select.Type.BUTTON}
                      size={Select.Size.M}
                      data={[{label: 'One'}, {label: 'Two'}]}
                    />
                  </ErrorBubble>
                </div>
              </div>
            </form>
          </Content>
        </Dialog>
      );
    }
  }

  return <ErrorBubbleDemo/>;
};

inDialogForm.story = {
  name: 'in dialog form',
  parameters: {
    hermione: {captureSelector: ['*[data-test~=ring-dialog]', '*[data-test~=ring-error-bubble]']},
    a11y: {element: '*[data-test~=ring-dialog],*[data-test~=ring-error-bubble]'}
  }
};
