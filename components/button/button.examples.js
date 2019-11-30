/* eslint-disable react/no-array-index-key */
import React, {Component, Fragment} from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import {PencilIcon, HourglassIcon} from '../icon';
import Loader from '../loader-inline/loader-inline';

import Button from './button';

export default {
  title: 'Components|Button',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'A component for displaying variously styled buttons.'
  }
};

export const basic = () => {
  function renderButtonModifications(theme) {
    return ['active', 'primary', 'danger', 'delayed', 'disabled', 'dropdown'].map(modifier => (
      <Button
        theme={theme}
        key={modifier}
        data-test={`button-${modifier}`}
        {...{[modifier]: true}}
      >
        Button {modifier}
      </Button>
    ));
  }

  function renderTextModifications(theme) {
    return ['primary', 'danger', 'disabled', 'loader'].map(modifier => (
      <Button text theme={theme} key={modifier} {...{[modifier]: true}}>
        Text action {modifier}
      </Button>
    ));
  }

  function renderIconWithTextModifications(theme) {
    return [
      {label: 'primary', primary: true},
      {label: 'danger', danger: true},
      {label: 'disabled', disabled: true},
      {label: 'primary-disabled', primary: true, disabled: true},
      {label: 'danger-disabled', danger: true, disabled: true}
    ].map((modifiers, index) => (
      <Button theme={theme} key={index} icon={PencilIcon} {...modifiers}>
        Icon action {modifiers.label}
      </Button>
    ));
  }

  function renderIconActionModifications(theme) {
    return [
      {label: 'primary', primary: true},
      {label: 'danger', danger: true},
      {label: 'disabled', disabled: true},
      {label: 'primary-disabled', primary: true, disabled: true},
      {label: 'danger-disabled', danger: true, disabled: true}
    ].map((modifiers, index) => (
      <Button
        theme={theme}
        key={index}
        title={`Just icon action (${modifiers.label})`}
        icon={PencilIcon}
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

        <Button icon={PencilIcon} loader>
          Icon loader
        </Button>

        {renderButtonModifications()}

        <Button text>Text action</Button>

        {renderTextModifications()}

        <Button icon={PencilIcon}>Icon action</Button>

        {renderIconWithTextModifications()}

        <Button icon={PencilIcon} title="Icon action"/>

        {renderIconActionModifications()}
      </div>

      <div className="buttons dark">
        <Button theme={Button.Theme.DARK}>Button default</Button>

        <Button theme={Button.Theme.DARK} short>
          ...
        </Button>

        <Button theme={Button.Theme.DARK} href="/">
          Button link
        </Button>

        <Button theme={Button.Theme.DARK} loader>
          Dark loader
        </Button>

        {renderButtonModifications(Button.Theme.DARK)}

        <Button theme={Button.Theme.DARK} text>
          Text action
        </Button>

        {renderTextModifications(Button.Theme.DARK)}

        <Button theme={Button.Theme.DARK} icon={PencilIcon}>
          Icon action
        </Button>

        {renderIconWithTextModifications(Button.Theme.DARK)}

        <Button icon={PencilIcon} theme={Button.Theme.DARK} title="Icon action"/>

        {renderIconActionModifications(Button.Theme.DARK)}
      </div>
    </div>
  );
};

basic.story = {
  name: 'basic',

  parameters: {
    hermione: {
      actions: [
        {type: 'capture', name: '', selector: '#root'},
        {type: 'focus', selector: '[data-test=button-active]'},
        {type: 'capture', name: 'focus active', selector: '#root'}
      ]
    },
    storyStyles: `
  <style>
    .buttons > button {
      margin: 8px;
    }

    .dark {
      background: #000;
    }
  </style>`
  }
};

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
      const date = new Date();
      let curDate;
      do {
        curDate = new Date();
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
          <Button title="Sleep" loader={loading} icon={HourglassIcon} onClick={this.load}/>
          {loading && <Loader/>}
        </Fragment>
      );
    }
  }

  return <Sleeper/>;
};

longAction.story = {
  name: 'long action',
  parameters: {hermione: {skip: true}}
};
