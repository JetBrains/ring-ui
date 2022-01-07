import React, {Component, Fragment} from 'react';
import pencilIcon from '@jetbrains/icons/pencil';
import hourglassIcon from '@jetbrains/icons/hourglass';

import reactDecorator from '../../.storybook/react-decorator';

import Loader from '../loader-inline/loader-inline';

import Theme, {ThemeProvider} from '../global/theme';

import {ControlsHeight, ControlsHeightContext} from '../global/controls-height';

import Button, {ButtonProps} from './button';

export default {
  title: 'Components/Button',
  decorators: [reactDecorator()],

  parameters: {
    component: Button,
    framework: 'react'
  },
  argTypes: {
    blue: {
      table: {disable: true}
    }
  }
};

export const single = (args: ButtonProps) => <Button {...args}/>;
single.args = {children: 'Label'};
single.parameters = {hermione: {skip: true}};

function Examples() {
  function renderButtonModifications() {
    return ['active', 'primary', 'danger', 'delayed', 'disabled', 'dropdown'].map(modifier => (
      <Button
        key={modifier}
        data-test={`button-${modifier}`}
        {...{[modifier]: true}}
      >
        Button {modifier}
      </Button>
    ));
  }

  function renderTextModifications() {
    return ['primary', 'danger', 'disabled', 'loader'].map(modifier => (
      <Button text key={modifier} {...{[modifier]: true}}>
        Text action {modifier}
      </Button>
    ));
  }

  function renderIconWithTextModifications() {
    return [
      {label: 'primary', primary: true},
      {label: 'danger', danger: true},
      {label: 'disabled', disabled: true},
      {label: 'primary-disabled', primary: true, disabled: true},
      {label: 'danger-disabled', danger: true, disabled: true}
    ].map(modifiers => (
      <Button key={modifiers.label} icon={pencilIcon} {...modifiers}>
        Icon action {modifiers.label}
      </Button>
    ));
  }

  function renderIconActionModifications() {
    return [
      {label: 'primary', primary: true},
      {label: 'danger', danger: true},
      {label: 'disabled', disabled: true},
      {label: 'primary-disabled', primary: true, disabled: true},
      {label: 'danger-disabled', danger: true, disabled: true}
    ].map(modifiers => (
      <Button
        key={modifiers.label}
        title={`Just icon action (${modifiers.label})`}
        icon={pencilIcon}
        {...modifiers}
      />
    ));
  }

  return (
    <div>
      <div className="buttons">
        <Button>Button default</Button>

        <Button short>...</Button>

        <Button href="/">Button link</Button>

        <Button loader>Button loader</Button>

        <Button primary loader>
          Primary loader
        </Button>

        <Button icon={pencilIcon} loader>
          Icon loader
        </Button>

        {renderButtonModifications()}

        <Button text>Text action</Button>

        {renderTextModifications()}

        <Button icon={pencilIcon}>Icon action</Button>

        {renderIconWithTextModifications()}

        <Button icon={pencilIcon} title="Icon action"/>

        {renderIconActionModifications()}
      </div>

      <ThemeProvider theme={Theme.DARK} className="buttons">
        <Button>Button default</Button>

        <Button short>
          ...
        </Button>

        <Button href="/">
          Button link
        </Button>

        <Button loader>
          Dark loader
        </Button>

        {renderButtonModifications()}

        <Button text>
          Text action
        </Button>

        {renderTextModifications()}

        <Button icon={pencilIcon}>
          Icon action
        </Button>

        {renderIconWithTextModifications()}

        <Button icon={pencilIcon} title="Icon action"/>

        {renderIconActionModifications()}
      </ThemeProvider>
    </div>
  );
}

export const basic = () => <Examples/>;

basic.storyName = 'basic';

basic.parameters = {
  hermione: {
    actions: [
      {type: 'capture', name: '', selector: '#root'},
      {type: 'focus', selector: '[data-test=button-active]'},
      {type: 'capture', name: 'focus active', selector: '#root'}
    ]
  },
  storyStyles: `
<style>
  .buttons {
    background: var(--ring-content-background-color);
  }

  .buttons > button {
    margin: 8px;
  }
</style>`
};

export const heightS = () => (
  <ControlsHeightContext.Provider value={ControlsHeight.S}>
    <Examples/>
  </ControlsHeightContext.Provider>
);
heightS.parameters = basic.parameters;

export const heightL = () => (
  <ControlsHeightContext.Provider value={ControlsHeight.L}>
    <Examples/>
  </ControlsHeightContext.Provider>
);
heightL.parameters = basic.parameters;

export const longAction = () => {
  class Sleeper extends Component {
    state = {
      loading: false
    };

    load = () => {
      this.setState({loading: true}, () => {
        setTimeout(this.sleep, 2000);
      });
    };

    sleep = () => {
      const date = Date.now();
      let curDate;
      do {
        curDate = Date.now();
      } while (curDate - date < 2000);

      this.setState({loading: false});
    };

    render() {
      const {loading} = this.state;
      return (
        <Fragment>
          <Button loader={loading} onClick={this.load}>
            Sleep
          </Button>
          <Button title="Sleep" loader={loading} icon={hourglassIcon} onClick={this.load}/>
          {loading && <Loader/>}
        </Fragment>
      );
    }
  }

  return <Sleeper/>;
};

longAction.storyName = 'long action';
longAction.parameters = {hermione: {skip: true}};
