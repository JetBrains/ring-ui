import React, {PureComponent} from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';

import Input, {Size, Theme} from './input';

storiesOf('Components|Input', module).
  addParameters({
    notes: 'Text input fields of varying size.'
  }).
  addDecorator(reactDecorator()).
  add('basic', () => {
    class ClearableInput extends PureComponent {
      state = {
        text: this.props.defaultValue
      };

      setText = e => {
        this.setState({
          text: e.target.value
        });
      };

      clear = () => {
        this.setState({
          text: ''
        });
      };

      render() {
        // eslint-disable-next-line no-unused-vars
        const {defaultValue, ...restProps} = this.props;
        return (
          <Input
            value={this.state.text}
            onChange={this.setText}
            onClear={this.clear}
            {...restProps}
          />
        );
      }
    }

    return (
      <form className="inputs">
        <Input label="Labeled input"/>
        <Input
          name="login"
          label="Label and hint"
          placeholder="Hint"
        />
        <Input
          label="Label and value"
          defaultValue="Default value"
        />
        <ClearableInput
          label="Clearable input"
          defaultValue="Default value"
        />
        <ClearableInput
          placeholder="Hint"
          label="Disabled clearable input"
          defaultValue="Default value"
          disabled
        />
        <ClearableInput
          placeholder="Hint"
          defaultValue="Borderless input"
          borderless
        />
        <Input
          label="Active input"
          active
          defaultValue="Default value"
        />
        <Input
          label="Disabled input"
          disabled
          defaultValue="Default value"
        />
        <Input
          label="Invalid input"
          error="Error description that wraps over lines because of being really long"
        />
        <Input
          label="Error without description"
          error=""
        />
        <Input
          label="Short input"
          size={Size.S}
        />
        <Input
          label="Long input"
          size={Size.L}
        />
        <Input
          label="Autogrowing textarea"
          multiline
        />
        <div className="dark">
          <Input
            label="Input on dark background"
            placeholder="Hint on dark background"
            theme={Theme.DARK}
          />
        </div>
      </form>
    );
  }, {
    storyStyles: `
<style>
  .inputs {
    display: flex;
    flex-flow: column wrap;
    max-height: 100vh;
    margin-top: 8px;
  }
  
  .inputs > div {
    margin: 0 16px;
  }
  
  .dark {
    background: #000;
    margin-left: 0;
    padding-left: 16px;
  }
</style>`
  });
