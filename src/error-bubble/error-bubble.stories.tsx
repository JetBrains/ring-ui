import {Component} from 'react';


import Select, {SingleSelectAttrs} from '../select/select';

import Dialog from '../dialog/dialog';
import {Header, Content} from '../island/island';
import '../form/form.css';
import '../input-size/input-size.css';

import ErrorBubble from './error-bubble';

export default {
  title: 'Components/ErrorBubble',

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
        <div style={{height: 32}}>
          <ErrorBubble<SingleSelectAttrs>
            error={value ? null : 'Value is required'}
            onSelect={selected => this.setState({value: selected})}
            inputPlaceholder="enter something"
          >
            <Select
              type={Select.Type.BUTTON}
              size={Select.Size.M}
              data={[{key: 0, label: 'One'}, {key: 1, label: 'Two'}]}
            />
          </ErrorBubble>
        </div>
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
                  <ErrorBubble<SingleSelectAttrs>
                    error={value ? null : 'Value is required'}
                    onSelect={selected => this.setState({value: selected})}
                    inputPlaceholder="enter something"
                  >
                    <Select
                      id="select"
                      type={Select.Type.BUTTON}
                      size={Select.Size.M}
                      data={[{key: 0, label: 'One'}, {key: 1, label: 'Two'}]}
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
  screenshots: {captureSelector: ['*[data-test~=ring-dialog]', '*[data-test~=ring-error-bubble]']},
  a11y: {element: '#storybook-root,*[data-test~=ring-dialog],*[data-test~=ring-error-bubble]'}
};
