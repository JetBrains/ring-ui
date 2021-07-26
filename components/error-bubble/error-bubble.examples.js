import React, {Component} from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Select from '@jetbrains/ring-ui/components/select/select';

import Dialog from '@jetbrains/ring-ui/components/dialog/dialog';
import {Header, Content} from '@jetbrains/ring-ui/components/island/island';
import '@jetbrains/ring-ui/components/form/form.css';
import '@jetbrains/ring-ui/components/input-size/input-size.css';

import ErrorBubble from '@jetbrains/ring-ui/components/error-bubble/error-bubble';

export default {
  title: 'Components/ErrorBubble',
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

basic.storyName = 'basic';

export const inDialogForm = () => {
  class ErrorBubbleDemo extends Component {
    state = {value: null};

    render() {
      const {value} = this.state;

      return (
        <Dialog label="Dialog" show>
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

inDialogForm.storyName = 'in dialog form';

inDialogForm.parameters = {
  hermione: {captureSelector: ['*[data-test~=ring-dialog]', '*[data-test~=ring-error-bubble]']},
  a11y: {element: '*[data-test~=ring-dialog],*[data-test~=ring-error-bubble]'}
};
