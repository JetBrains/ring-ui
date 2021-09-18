import React, {PureComponent, useRef} from 'react';
import searchIcon from '@jetbrains/icons/search';

import reactDecorator from '../../.storybook/react-decorator';

import Button from '@jetbrains/ring-ui/components/button/button';
import Text from '@jetbrains/ring-ui/components/text/text';

import Input, {ContainerProps, InputSpecificProps, Size, Theme} from '@jetbrains/ring-ui/components/input/input';

export default {
  title: 'Components/Input',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Text input fields of varying size.'
  }
};

export const basic = () => {
  class ClearableInput extends PureComponent<ContainerProps<InputSpecificProps>> {
    state = {
      text: this.props.defaultValue
    };

    setText = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <Input name="login" label="Label and hint" placeholder="Hint"/>
      <Input label="Label and value" defaultValue="Default value"/>
      <ClearableInput label="Clearable input" defaultValue="Default value"/>
      <ClearableInput
        placeholder="Hint"
        label="Disabled clearable input"
        defaultValue="Default value"
        disabled
      />
      <Input label="Input with icon" icon={searchIcon}/>
      <ClearableInput placeholder="Hint" defaultValue="Borderless input" borderless/>
      <ClearableInput placeholder="Hint" defaultValue="Compact input" compact icon={searchIcon}/>
      <Input label="Disabled input" disabled defaultValue="Default value"/>
      <Input
        label="Invalid input"
        error="Error description that wraps over lines because of being really long"
      />
      <Input label="Error without description" error=""/>
      <Input label="Short input" size={Size.S}/>
      <Input label="Long input" size={Size.L}/>
      <Input
        label="Underline message"
        renderUnderline={() => <Text info>With custom underline</Text>}
      />
      <Input label="Autogrowing textarea" multiline/>
      <div className="dark">
        <Input
          label="Input on dark background"
          placeholder="Hint on dark background"
          theme={Theme.DARK}
        />
      </div>
    </form>
  );
};

basic.storyName = 'basic';

basic.parameters = {
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
};

function SelectAll() {
  const ref = useRef<HTMLInputElement>(null);

  function select() {
    if (ref.current != null) {
      ref.current.select();
    }
  }

  return (
    <>
      <Input defaultValue="Value" inputRef={ref} label="Label"/>
      <Button data-test-select onClick={select}>Select all</Button>
    </>
  );
}

export const selectAll = () => <SelectAll/>;

selectAll.parameters = {
  hermione: {
    actions: [
      {type: 'click', selector: '[data-test-select]'},
      {type: 'capture', selector: '#root'}
    ]
  }
};
