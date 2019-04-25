import React, {Component} from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import Select from '../select/select';

import Dialog from '../dialog/dialog';
import {Header, Content} from '../island/island';
import '../form/form.scss';
import '../input-size/input-size.scss';

import ErrorBubble from './error-bubble';

storiesOf('Components|ErrorBubble', module).
  addDecorator(reactDecorator()).
  add('basic', () => {
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
  }).
  add('in dialog form', () => {
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
                  <label className="ring-form__label">Field name</label>
                  <div className="ring-form__control ring-form__control_small">
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
                  </div>
                </div>
              </form>
            </Content>
          </Dialog>
        );
      }
    }

    return <ErrorBubbleDemo/>;
  });
