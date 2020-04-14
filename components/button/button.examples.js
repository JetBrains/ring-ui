import React, {Component, Fragment} from 'react';
import pencilIcon from '@jetbrains/icons/pencil.svg';
import hourglassIcon from '@jetbrains/icons/hourglass.svg';

import reactDecorator from '../../.storybook/react-decorator';

import Loader from '@jetbrains/ring-ui/components/loader-inline/loader-inline';

import Theme, {ThemeContext} from '@jetbrains/ring-ui/components/global/theme';

import Button from '@jetbrains/ring-ui/components/button/button';

export default {
  title: 'Components/Button',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'A component for displaying variously styled buttons.'
  }
};

export const basic = () => {
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

      <div className="buttons dark">
        <ThemeContext.Provider value={Theme.DARK}>
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
        </ThemeContext.Provider>
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
          <Button title="Sleep" loader={loading} icon={hourglassIcon} onClick={this.load}/>
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
