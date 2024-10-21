import {useRef, useState} from 'react';
import searchIcon from '@jetbrains/icons/search';

import Button from '../button/button';

import {ControlsHeight, ControlsHeightContext} from '../global/controls-height';

import {LabelType} from '../control-label/control-label';

import Input, {Size} from './input';

export default {
  title: 'Components/Input',

  parameters: {
    notes: 'Text input fields of varying size.',
    zeplinLink: 'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/6193bc70ab2b23a8ca449004',
  },
};

export const Basic = () => {
  const [clearableInputValue, setClearableInputValue] = useState('Default value');
  const [borderlessInputValue, setBorderlessInputValue] = useState('Borderless input');

  return (
    <form className="inputs">
      <Input label="Labeled input" />
      <Input name="login" label="Label and hint" placeholder="Hint" />
      <Input label="Label and value" defaultValue="Default value" />
      <Input
        label="Clearable input"
        value={clearableInputValue}
        onChange={e => setClearableInputValue(e.currentTarget.value)}
        onClear={() => setClearableInputValue('')}
      />
      <Input
        placeholder="Hint"
        label="Disabled clearable input"
        defaultValue="Default value"
        onClear={() => {}}
        disabled
      />
      <Input label="Input with icon" icon={searchIcon} defaultValue="Default value" />
      <Input name="login" label="Primary label" labelType={LabelType.FORM} placeholder="Hint" />
      <Input
        placeholder="Hint"
        value={borderlessInputValue}
        onChange={e => setBorderlessInputValue(e.currentTarget.value)}
        onClear={() => setBorderlessInputValue('')}
        borderless
      />
      <Input label="Disabled input" disabled defaultValue="Default value" />
      <Input label="Invalid input" error="Error description that wraps over lines because of being really long" />
      <Input label="Error without description" error="" />
      <Input label="Input with help" help="Help text" />
      <Input label="Short input" size={Size.S} />
      <Input label="Long input" size={Size.L} />
      <Input label="Autogrowing textarea" multiline defaultValue={'First line\nSecond line'} />
    </form>
  );
};

Basic.storyName = 'basic';

Basic.parameters = {
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
</style>`,
};

export const HeightS = () => {
  const [clearableInputValue, setClearableInputValue] = useState('Default value');
  const [borderlessInputValue, setBorderlessInputValue] = useState('Borderless input');

  return (
    <ControlsHeightContext.Provider value={ControlsHeight.S}>
      <form className="inputs">
        <Input label="Labeled input" />
        <Input name="login" label="Label and hint" placeholder="Hint" />
        <Input label="Label and value" defaultValue="Default value" />
        <Input
          label="Clearable input"
          value={clearableInputValue}
          onChange={e => setClearableInputValue(e.currentTarget.value)}
          onClear={() => setClearableInputValue('')}
        />
        <Input
          placeholder="Hint"
          label="Disabled clearable input"
          defaultValue="Default value"
          onClear={() => {}}
          disabled
        />
        <Input label="Input with icon" icon={searchIcon} defaultValue="Default value" />
        <Input name="login" label="Primary label" labelType={LabelType.FORM} placeholder="Hint" />
        <Input
          placeholder="Hint"
          value={borderlessInputValue}
          onChange={e => setBorderlessInputValue(e.currentTarget.value)}
          onClear={() => setBorderlessInputValue('')}
          borderless
        />
        <Input label="Disabled input" disabled defaultValue="Default value" />
        <Input label="Invalid input" error="Error description that wraps over lines because of being really long" />
        <Input label="Error without description" error="" />
        <Input label="Input with help" help="Help text" />
        <Input label="Short input" size={Size.S} />
        <Input label="Long input" size={Size.L} />
        <Input label="Autogrowing textarea" multiline defaultValue={'First line\nSecond line'} />
      </form>
    </ControlsHeightContext.Provider>
  );
};
HeightS.parameters = Basic.parameters;

export const SelectAll = () => {
  const ref = useRef<HTMLInputElement>(null);

  function select() {
    if (ref.current != null) {
      ref.current.select();
    }
  }

  return (
    <>
      <Input defaultValue="Value" inputRef={ref} label="Label" />
      <Button style={{marginTop: 4}} data-test-select onClick={select}>
        Select all
      </Button>
    </>
  );
};

SelectAll.parameters = {
  screenshots: {
    actions: [
      {type: 'click', selector: '[data-test-select]'},
      {type: 'capture', selector: '#storybook-root'},
    ],
  },
};
