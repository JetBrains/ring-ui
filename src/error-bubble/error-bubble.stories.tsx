import {Component} from 'react';

import Select, {type SingleSelectAttrs} from '../select/select';
import Dialog from '../dialog/dialog';
import {Header, Content} from '../island/island';
import ErrorBubble from './error-bubble';

export default {
  title: 'Components/ErrorBubble',

  parameters: {
    notes:
      'Displays an error bubble near the wrapped input component when a non-empty string is passed to the `error` prop. * Passes any prop except `className` down to the input.',
  },
};

export const basic = () => {
  class ErrorBubbleDemo extends Component {
    state = {value: null};

    render() {
      const {value} = this.state;

      return (
        <div style={{height: 32}}>
          <ErrorBubble<SingleSelectAttrs>
            error={value ? null : 'Value is required'}
            onSelect={selected => this.setState({value: selected})}
            inputPlaceholder='enter something'
          >
            <Select
              type={Select.Type.BUTTON}
              size={Select.Size.M}
              data={[
                {key: 0, label: 'One'},
                {key: 1, label: 'Two'},
              ]}
            />
          </ErrorBubble>
        </div>
      );
    }
  }

  return <ErrorBubbleDemo />;
};

basic.storyName = 'basic';

export const inDialogForm = () => {
  class ErrorBubbleDemo extends Component {
    state = {value: null};

    render() {
      const {value} = this.state;

      return (
        <Dialog label='Dialog' show>
          <Header>Dialog example</Header>
          <Content>
            <div style={{marginBottom: '16px'}}>
              <div style={{display: 'grid', gridTemplateColumns: '144px 1fr', gap: '16px', alignItems: 'start'}}>
                <label htmlFor='select' style={{paddingTop: '4px'}}>
                  Field name
                </label>
                <div>
                  <ErrorBubble<SingleSelectAttrs>
                    error={value ? null : 'Value is required'}
                    onSelect={selected => this.setState({value: selected})}
                    inputPlaceholder='enter something'
                  >
                    <Select
                      id='select'
                      type={Select.Type.BUTTON}
                      size={Select.Size.M}
                      data={[
                        {key: 0, label: 'One'},
                        {key: 1, label: 'Two'},
                      ]}
                    />
                  </ErrorBubble>
                </div>
              </div>
            </div>
          </Content>
        </Dialog>
      );
    }
  }

  return <ErrorBubbleDemo />;
};

inDialogForm.storyName = 'in dialog form';
inDialogForm.tags = ['!autodocs'];
inDialogForm.parameters = {
  screenshots: {captureSelector: ['*[data-test~=ring-dialog]', '*[data-test~=ring-error-bubble]']},
  a11y: {context: '#storybook-root,*[data-test~=ring-dialog],*[data-test~=ring-error-bubble]'},
};

export const multiline = () => (
  <ErrorBubble
    error={`Enter a name to continue
second line`}
  />
);
multiline.parameters = {
  screenshots: {captureSelector: '*[data-test~=ring-error-bubble]'},
};
