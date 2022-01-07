import React, {PureComponent, useRef} from 'react';
import searchIcon from '@jetbrains/icons/search';

import reactDecorator from '../../.storybook/react-decorator';

import Button from '../button/button';

import Theme, {ThemeProvider} from '../global/theme';

import {ControlsHeight, ControlsHeightContext} from '../global/controls-height';

import Input, {ContainerProps, InputSpecificProps, Size} from './input';

export default {
  title: 'Components/Input',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Text input fields of varying size.',
    zeplinLink: 'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/6193bc70ab2b23a8ca449004'
  }
};

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
const Inputs = () => (
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
    <Input label="Input with icon" icon={searchIcon} defaultValue="Default value"/>
    <ClearableInput placeholder="Hint" defaultValue="Borderless input" borderless/>
    <Input label="Disabled input" disabled defaultValue="Default value"/>
    <Input
      label="Invalid input"
      error="Error description that wraps over lines because of being really long"
    />
    <Input label="Error without description" error=""/>
    <Input label="Short input" size={Size.S}/>
    <Input label="Long input" size={Size.L}/>
    <Input label="Autogrowing textarea" multiline/>
    <ThemeProvider theme={Theme.DARK} className="dark inputs">
      <Input
        label="Input on dark background"
        placeholder="Hint on dark background"
      />
      <Input
        disabled
        label="Disabled input on dark background"
        defaultValue="Default value on dark background"
      />
    </ThemeProvider>
  </form>
);
export const basic = () => <Inputs/>;

basic.storyName = 'basic';

basic.parameters = {
  storyStyles: `
<style>
  .inputs {
    display: flex;
    flex-flow: column wrap;
    max-height: 100vh;
    margin-top: 8px;
    background: var(--ring-content-background-color);
  }

  .inputs > div {
    margin: 0 16px 8px;
  }

  .dark.dark {
    margin: 0 -16px;
    padding: 8px 16px;
  }
</style>`
};

export const heightS = () => (
  <ControlsHeightContext.Provider value={ControlsHeight.S}>
    <Inputs/>
  </ControlsHeightContext.Provider>
);
heightS.parameters = basic.parameters;

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
      <Button style={{marginTop: 4}} data-test-select onClick={select}>Select all</Button>
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
