import {Component, Fragment} from 'react';
import pencilIcon from '@jetbrains/icons/pencil';
import pencil12pxIcon from '@jetbrains/icons/pencil-12px';
import hourglassIcon from '@jetbrains/icons/hourglass';

import Loader from '../loader-inline/loader-inline';

import {ControlsHeight, ControlsHeightContext} from '../global/controls-height';

import Button, {ButtonProps} from './button';

export default {
  title: 'Components/Button',

  component: Button,
  parameters: {
    zeplinLink: 'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/6193bc70fc4aa2a937f165ad',
  },
  argTypes: {
    blue: {
      table: {disable: true},
    },
  },
};

export const single = (args: ButtonProps) => <Button {...args} />;
single.args = {children: 'Label'};
single.parameters = {screenshots: {skip: true}};

export const basic = () => (
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

    {['active', 'primary', 'danger', 'delayed', 'disabled', 'primary disabled', 'dropdown'].map(joinedModifiers => {
      const modifiers = joinedModifiers.split(' ');
      return (
        <Button
          key={joinedModifiers}
          data-test={`button-${modifiers.join('-')}`}
          {...Object.fromEntries(modifiers.map(modifier => [modifier, true]))}
        >
          Button {joinedModifiers}
        </Button>
      );
    })}

    <Button inline={false} icon={pencilIcon}>
      Icon button
    </Button>

    {[
      {label: 'primary', primary: true},
      {label: 'danger', danger: true},
      {label: 'disabled', disabled: true},
      {label: 'primary-disabled', primary: true, disabled: true},
      {label: 'danger-disabled', danger: true, disabled: true},
    ].map(modifiers => (
      <Button inline={false} key={modifiers.label} icon={pencilIcon} {...modifiers}>
        Icon button {modifiers.label}
      </Button>
    ))}

    <Button inline={false} icon={pencilIcon} title="Icon button" />

    {[
      {label: 'primary', primary: true},
      {label: 'danger', danger: true},
      {label: 'disabled', disabled: true},
      {label: 'primary-disabled', primary: true, disabled: true},
      {label: 'danger-disabled', danger: true, disabled: true},
    ].map(modifiers => (
      <Button
        key={modifiers.label}
        title={`Just icon button (${modifiers.label})`}
        inline={false}
        icon={pencilIcon}
        {...modifiers}
      />
    ))}

    <Button inline>Text action</Button>

    {['primary', 'danger', 'disabled', 'loader', 'dropdown'].map(modifier => (
      <Button inline key={modifier} {...{[modifier]: true}}>
        Text action {modifier}
      </Button>
    ))}

    <Button icon={pencilIcon}>Icon action</Button>

    {[
      {label: 'primary', primary: true},
      {label: 'danger', danger: true},
      {label: 'disabled', disabled: true},
      {label: 'primary-disabled', primary: true, disabled: true},
      {label: 'danger-disabled', danger: true, disabled: true},
    ].map(modifiers => (
      <Button key={modifiers.label} icon={pencilIcon} {...modifiers}>
        Icon action {modifiers.label}
      </Button>
    ))}

    <Button icon={pencilIcon} title="Icon action" />

    {[
      {label: 'primary', primary: true},
      {label: 'danger', danger: true},
      {label: 'disabled', disabled: true},
      {label: 'primary-disabled', primary: true, disabled: true},
      {label: 'danger-disabled', danger: true, disabled: true},
    ].map(modifiers => (
      <Button key={modifiers.label} title={`Just icon action (${modifiers.label})`} icon={pencilIcon} {...modifiers} />
    ))}
  </div>
);

basic.storyName = 'basic';

basic.parameters = {
  screenshots: {
    actions: [
      {type: 'capture', name: '', selector: '#storybook-root'},
      {type: 'focus', selector: '[data-test=button-active]'},
      {type: 'capture', name: 'focus active', selector: '#storybook-root'},
    ],
  },
  storyStyles: `
<style>
  .buttons {
    background: var(--ring-content-background-color);
  }

  .buttons > :is(button, a) {
    margin: 8px;
  }
</style>`,
};

export const heightS = () => (
  <ControlsHeightContext.Provider value={ControlsHeight.S}>
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

      {['active', 'primary', 'danger', 'delayed', 'disabled', 'primary disabled', 'dropdown'].map(joinedModifiers => {
        const modifiers = joinedModifiers.split(' ');
        return (
          <Button
            key={joinedModifiers}
            data-test={`button-${modifiers.join('-')}`}
            {...Object.fromEntries(modifiers.map(modifier => [modifier, true]))}
          >
            Button {joinedModifiers}
          </Button>
        );
      })}

      <Button inline={false} icon={pencil12pxIcon}>
        Icon button
      </Button>

      {[
        {label: 'primary', primary: true},
        {label: 'danger', danger: true},
        {label: 'disabled', disabled: true},
        {label: 'primary-disabled', primary: true, disabled: true},
        {label: 'danger-disabled', danger: true, disabled: true},
      ].map(modifiers => (
        <Button inline={false} key={modifiers.label} icon={pencil12pxIcon} {...modifiers}>
          Icon button {modifiers.label}
        </Button>
      ))}

      <Button inline={false} icon={pencil12pxIcon} title="Icon button" />

      {[
        {label: 'primary', primary: true},
        {label: 'danger', danger: true},
        {label: 'disabled', disabled: true},
        {label: 'primary-disabled', primary: true, disabled: true},
        {label: 'danger-disabled', danger: true, disabled: true},
      ].map(modifiers => (
        <Button
          key={modifiers.label}
          title={`Just icon button (${modifiers.label})`}
          inline={false}
          icon={pencil12pxIcon}
          {...modifiers}
        />
      ))}

      <Button inline>Text action</Button>

      {['primary', 'danger', 'disabled', 'loader', 'dropdown'].map(modifier => (
        <Button inline key={modifier} {...{[modifier]: true}}>
          Text action {modifier}
        </Button>
      ))}

      <Button icon={pencilIcon}>Icon action</Button>

      {[
        {label: 'primary', primary: true},
        {label: 'danger', danger: true},
        {label: 'disabled', disabled: true},
        {label: 'primary-disabled', primary: true, disabled: true},
        {label: 'danger-disabled', danger: true, disabled: true},
      ].map(modifiers => (
        <Button key={modifiers.label} icon={pencilIcon} {...modifiers}>
          Icon action {modifiers.label}
        </Button>
      ))}

      <Button icon={pencilIcon} title="Icon action" />

      {[
        {label: 'primary', primary: true},
        {label: 'danger', danger: true},
        {label: 'disabled', disabled: true},
        {label: 'primary-disabled', primary: true, disabled: true},
        {label: 'danger-disabled', danger: true, disabled: true},
      ].map(modifiers => (
        <Button
          key={modifiers.label}
          title={`Just icon action (${modifiers.label})`}
          icon={pencilIcon}
          {...modifiers}
        />
      ))}
    </div>
  </ControlsHeightContext.Provider>
);
heightS.parameters = basic.parameters;

export const heightL = () => (
  <ControlsHeightContext.Provider value={ControlsHeight.L}>
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

      {['active', 'primary', 'danger', 'delayed', 'disabled', 'primary disabled', 'dropdown'].map(joinedModifiers => {
        const modifiers = joinedModifiers.split(' ');
        return (
          <Button
            key={joinedModifiers}
            data-test={`button-${modifiers.join('-')}`}
            {...Object.fromEntries(modifiers.map(modifier => [modifier, true]))}
          >
            Button {joinedModifiers}
          </Button>
        );
      })}

      <Button inline={false} icon={pencilIcon}>
        Icon button
      </Button>

      {[
        {label: 'primary', primary: true},
        {label: 'danger', danger: true},
        {label: 'disabled', disabled: true},
        {label: 'primary-disabled', primary: true, disabled: true},
        {label: 'danger-disabled', danger: true, disabled: true},
      ].map(modifiers => (
        <Button inline={false} key={modifiers.label} icon={pencilIcon} {...modifiers}>
          Icon button {modifiers.label}
        </Button>
      ))}

      <Button inline={false} icon={pencilIcon} title="Icon button" />

      {[
        {label: 'primary', primary: true},
        {label: 'danger', danger: true},
        {label: 'disabled', disabled: true},
        {label: 'primary-disabled', primary: true, disabled: true},
        {label: 'danger-disabled', danger: true, disabled: true},
      ].map(modifiers => (
        <Button
          key={modifiers.label}
          title={`Just icon button (${modifiers.label})`}
          inline={false}
          icon={pencilIcon}
          {...modifiers}
        />
      ))}

      <Button inline>Text action</Button>

      {['primary', 'danger', 'disabled', 'loader', 'dropdown'].map(modifier => (
        <Button inline key={modifier} {...{[modifier]: true}}>
          Text action {modifier}
        </Button>
      ))}

      <Button icon={pencilIcon}>Icon action</Button>

      {[
        {label: 'primary', primary: true},
        {label: 'danger', danger: true},
        {label: 'disabled', disabled: true},
        {label: 'primary-disabled', primary: true, disabled: true},
        {label: 'danger-disabled', danger: true, disabled: true},
      ].map(modifiers => (
        <Button key={modifiers.label} icon={pencilIcon} {...modifiers}>
          Icon action {modifiers.label}
        </Button>
      ))}

      <Button icon={pencilIcon} title="Icon action" />

      {[
        {label: 'primary', primary: true},
        {label: 'danger', danger: true},
        {label: 'disabled', disabled: true},
        {label: 'primary-disabled', primary: true, disabled: true},
        {label: 'danger-disabled', danger: true, disabled: true},
      ].map(modifiers => (
        <Button
          key={modifiers.label}
          title={`Just icon action (${modifiers.label})`}
          icon={pencilIcon}
          {...modifiers}
        />
      ))}
    </div>
  </ControlsHeightContext.Provider>
);
heightL.parameters = basic.parameters;

export const longAction = () => {
  class Sleeper extends Component {
    state = {
      loading: false,
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
          <Button title="Sleep" loader={loading} icon={hourglassIcon} onClick={this.load} />
          {loading && <Loader />}
        </Fragment>
      );
    }
  }

  return <Sleeper />;
};

longAction.storyName = 'long action';
longAction.parameters = {screenshots: {skip: true}};
